#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  DEPLOY_PASSWORD=... [DEPLOY_HOST=216.126.235.10] [DEPLOY_USER=root] bash scripts/redeploy-hasura-vps.sh

Optional environment variables:
  DEPLOY_HOST          Remote host. Default: 216.126.235.10
  DEPLOY_USER          Remote SSH user. Default: root
  DEPLOY_PASSWORD      Remote SSH password. Required.
  DEPLOY_REMOTE_DIR    Remote project directory. Default: /opt/b2bnotes/graphql-api
  PROJECT_DIR          Local graphql-api directory. Default: <repo>/graphql-api
  DDN_BIN              DDN CLI path. Default: /usr/local/bin/ddn
EOF
}

if [[ "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_DIR="${PROJECT_DIR:-$REPO_ROOT/graphql-api}"
DEPLOY_HOST="${DEPLOY_HOST:-216.126.235.10}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PASSWORD="${DEPLOY_PASSWORD:-}"
DEPLOY_REMOTE_DIR="${DEPLOY_REMOTE_DIR:-/opt/b2bnotes/graphql-api}"
DDN_BIN="${DDN_BIN:-/usr/local/bin/ddn}"

if [[ -z "$DEPLOY_PASSWORD" ]]; then
  echo "DEPLOY_PASSWORD is required." >&2
  usage >&2
  exit 1
fi

if [[ ! -x "$DDN_BIN" ]]; then
  if command -v ddn >/dev/null 2>&1; then
    DDN_BIN="$(command -v ddn)"
  else
    echo "Could not find the DDN CLI. Set DDN_BIN or install ddn." >&2
    exit 1
  fi
fi

need_cmd expect
need_cmd tar
need_cmd ssh
need_cmd scp

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Project directory not found: $PROJECT_DIR" >&2
  exit 1
fi

archive_path="$(mktemp /tmp/graphql-api.XXXXXX.tgz)"
cleanup() {
  rm -f "$archive_path"
}
trap cleanup EXIT

run_expect_ssh() {
  local remote_command="$1"
  EXPECT_HOST="$DEPLOY_HOST" \
  EXPECT_USER="$DEPLOY_USER" \
  EXPECT_PASSWORD="$DEPLOY_PASSWORD" \
  EXPECT_COMMAND="$remote_command" \
  expect <<'EOF'
set timeout -1
set host $env(EXPECT_HOST)
set user $env(EXPECT_USER)
set password $env(EXPECT_PASSWORD)
set remote_command $env(EXPECT_COMMAND)
spawn ssh -o StrictHostKeyChecking=no $user@$host bash -lc $remote_command
expect {
  -re {.*yes/no.*} { send "yes\r"; exp_continue }
  -re {.*password:.*} { send "$password\r" }
}
expect eof
catch wait result
exit [lindex $result 3]
EOF
}

run_expect_scp() {
  local local_path="$1"
  local remote_path="$2"
  EXPECT_HOST="$DEPLOY_HOST" \
  EXPECT_USER="$DEPLOY_USER" \
  EXPECT_PASSWORD="$DEPLOY_PASSWORD" \
  EXPECT_LOCAL_PATH="$local_path" \
  EXPECT_REMOTE_PATH="$remote_path" \
  expect <<'EOF'
set timeout -1
set host $env(EXPECT_HOST)
set user $env(EXPECT_USER)
set password $env(EXPECT_PASSWORD)
set local_path $env(EXPECT_LOCAL_PATH)
set remote_path $env(EXPECT_REMOTE_PATH)
spawn scp -o StrictHostKeyChecking=no $local_path $user@$host:$remote_path
expect {
  -re {.*yes/no.*} { send "yes\r"; exp_continue }
  -re {.*password:.*} { send "$password\r" }
}
expect eof
catch wait result
exit [lindex $result 3]
EOF
}

echo "Building local DDN artifacts from $PROJECT_DIR"
(
  cd "$PROJECT_DIR"
  "$DDN_BIN" supergraph build local
)

echo "Reading current DDN access token"
hasura_ddn_pat="$("$DDN_BIN" auth print-access-token)"

echo "Packing graphql-api"
COPYFILE_DISABLE=1 tar -C "$REPO_ROOT" -czf "$archive_path" graphql-api

remote_archive="/tmp/$(basename "$archive_path")"
remote_parent_dir="$(dirname "$DEPLOY_REMOTE_DIR")"
remote_staged_dir="$remote_parent_dir/graphql-api"
remote_command=$(cat <<EOF
set -euo pipefail
mkdir -p "$remote_parent_dir"
rm -rf "$DEPLOY_REMOTE_DIR"
rm -rf "$remote_staged_dir"
tar -xzf "$remote_archive" -C "$remote_parent_dir"
if [ "$remote_staged_dir" != "$DEPLOY_REMOTE_DIR" ]; then
  mv "$remote_staged_dir" "$DEPLOY_REMOTE_DIR"
fi
cd "$DEPLOY_REMOTE_DIR"
sed -i '/^HASURA_DDN_PAT=/d' .env
printf 'HASURA_DDN_PAT=%s\n' '$hasura_ddn_pat' >> .env
docker compose -f compose.yaml --env-file .env up -d --build --pull always
docker compose -f compose.yaml --env-file .env ps -q | xargs -r docker update --restart unless-stopped
docker compose -f compose.yaml --env-file .env ps
EOF
)

echo "Uploading archive to $DEPLOY_USER@$DEPLOY_HOST"
run_expect_scp "$archive_path" "$remote_archive"

echo "Redeploying on $DEPLOY_HOST"
run_expect_ssh "$remote_command"

echo "Redeploy complete: http://$DEPLOY_HOST:3280/graphql"
