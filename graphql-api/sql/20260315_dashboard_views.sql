DROP VIEW IF EXISTS public.dashboard_alerts;
DROP VIEW IF EXISTS public.dashboard_category_spend;
DROP VIEW IF EXISTS public.dashboard_products;
DROP VIEW IF EXISTS public.dashboard_employee_spend;
DROP VIEW IF EXISTS public.dashboard_summary;
DROP VIEW IF EXISTS public.dashboard_receipt_history;
DROP VIEW IF EXISTS public.dashboard_receipt_items_periodized;
DROP VIEW IF EXISTS public.dashboard_receipts_periodized;

CREATE VIEW public.dashboard_receipts_periodized AS
WITH base_receipts AS (
  SELECT
    receipts.company_id,
    receipts.created_at,
    receipts.flagged_reason,
    receipts.id AS receipt_id,
    receipts.image_url,
    receipts.raw_text,
    receipts.receipt_date,
    receipts.status,
    receipts.total_amount,
    receipts.user_id,
    COALESCE(users.full_name, 'Funcionário desconhecido') AS user_name,
    receipts.vendor_name,
    COALESCE(receipts.vendor_tax_id, '') AS vendor_tax_id,
    COALESCE(receipts.vendor_tax_id_valid, FALSE) AS vendor_tax_id_valid
  FROM public.receipts
  INNER JOIN public.users
    ON users.id = receipts.user_id
  WHERE receipts.total_amount > 0
    AND receipts.status IS DISTINCT FROM 'processing'
    AND EXISTS (
      SELECT 1
      FROM public.receipt_items
      WHERE receipt_items.receipt_id = receipts.id
    )
)
SELECT
  base_receipts.company_id,
  periods.period_key,
  base_receipts.created_at,
  base_receipts.flagged_reason,
  base_receipts.image_url,
  base_receipts.raw_text,
  base_receipts.receipt_date,
  base_receipts.receipt_id,
  base_receipts.status,
  base_receipts.total_amount,
  base_receipts.user_id,
  base_receipts.user_name,
  base_receipts.vendor_name,
  base_receipts.vendor_tax_id,
  base_receipts.vendor_tax_id_valid
FROM base_receipts
CROSS JOIN LATERAL (
  VALUES
    ('all'::text, TRUE),
    ('90d'::text, base_receipts.receipt_date >= CURRENT_DATE - INTERVAL '89 days'),
    ('30d'::text, base_receipts.receipt_date >= CURRENT_DATE - INTERVAL '29 days'),
    ('7d'::text, base_receipts.receipt_date >= CURRENT_DATE - INTERVAL '6 days')
) AS periods(period_key, include_row)
WHERE periods.include_row;

CREATE VIEW public.dashboard_receipt_items_periodized AS
WITH item_sources AS (
  SELECT
    dashboard_receipts_periodized.company_id,
    dashboard_receipts_periodized.created_at,
    dashboard_receipts_periodized.flagged_reason,
    dashboard_receipts_periodized.image_url,
    dashboard_receipts_periodized.period_key,
    dashboard_receipts_periodized.raw_text,
    dashboard_receipts_periodized.receipt_date,
    dashboard_receipts_periodized.receipt_id,
    dashboard_receipts_periodized.status,
    dashboard_receipts_periodized.total_amount,
    dashboard_receipts_periodized.user_id,
    dashboard_receipts_periodized.user_name,
    dashboard_receipts_periodized.vendor_name,
    dashboard_receipts_periodized.vendor_tax_id,
    dashboard_receipts_periodized.vendor_tax_id_valid,
    receipt_items.category,
    receipt_items.id AS item_id,
    receipt_items.normalized_description,
    receipt_items.raw_description,
    COALESCE(receipt_items.quantity, 0) AS quantity,
    receipt_items.total_price,
    receipt_items.unit_price,
    LOWER(
      TRIM(
        CONCAT_WS(
          ' ',
          COALESCE(receipt_items.category, ''),
          COALESCE(receipt_items.normalized_description, '')
        )
      )
    ) AS source_text
  FROM public.dashboard_receipts_periodized
  INNER JOIN public.receipt_items
    ON receipt_items.receipt_id = dashboard_receipts_periodized.receipt_id
)
SELECT
  item_sources.category,
  item_sources.company_id,
  item_sources.created_at,
  CASE
    WHEN item_sources.source_text ~ '(food|meal|lunch|breakfast|dinner|restaurant|grocery|pantry|snack|beverage|coffee|alimento|alimentação|refeicao|refeição|almoco|almoço|jantar|mercado|lanche|bebida|cafe|café)'
      THEN 'food'
    WHEN item_sources.source_text ~ '(fuel|gas|gasoline|diesel|petrol|station|combustivel|combustível|gasolina|etanol|posto)'
      THEN 'fuel'
    WHEN item_sources.source_text ~ '(office|stationery|paper|printer|ink|toner|supply|supplies|escritorio|escritório|papelaria|material|suprimento|suprimentos)'
      THEN 'office-supplies'
    WHEN item_sources.source_text ~ '(clean|cleaning|detergent|soap|bleach|sanitizer|disinfectant|limpeza|detergente|sabao|sabão|agua sanitaria|água sanitária|sanitizante|desinfetante)'
      THEN 'cleaning'
    ELSE 'other'
  END AS dashboard_category,
  item_sources.flagged_reason,
  item_sources.image_url,
  item_sources.item_id,
  item_sources.normalized_description,
  item_sources.period_key,
  item_sources.quantity,
  item_sources.raw_description,
  item_sources.raw_text,
  item_sources.receipt_date,
  item_sources.receipt_id,
  item_sources.source_text,
  item_sources.status,
  item_sources.total_amount,
  item_sources.total_price,
  item_sources.unit_price,
  item_sources.user_id,
  item_sources.user_name,
  item_sources.vendor_name,
  item_sources.vendor_tax_id,
  item_sources.vendor_tax_id_valid
FROM item_sources;

CREATE VIEW public.dashboard_summary AS
WITH product_totals AS (
  SELECT
    company_id,
    period_key,
    COUNT(DISTINCT normalized_description) AS unique_products
  FROM public.dashboard_receipt_items_periodized
  GROUP BY company_id, period_key
)
SELECT
  dashboard_receipts_periodized.company_id,
  dashboard_receipts_periodized.period_key,
  COUNT(DISTINCT dashboard_receipts_periodized.receipt_id) AS receipts_processed,
  SUM(dashboard_receipts_periodized.total_amount) AS total_spent,
  COUNT(DISTINCT dashboard_receipts_periodized.user_id) AS unique_employees,
  COALESCE(product_totals.unique_products, 0) AS unique_products
FROM public.dashboard_receipts_periodized
LEFT JOIN product_totals
  ON product_totals.company_id = dashboard_receipts_periodized.company_id
 AND product_totals.period_key = dashboard_receipts_periodized.period_key
GROUP BY
  dashboard_receipts_periodized.company_id,
  dashboard_receipts_periodized.period_key,
  product_totals.unique_products;

CREATE VIEW public.dashboard_employee_spend AS
WITH category_totals AS (
  SELECT
    company_id,
    period_key,
    user_id,
    dashboard_category,
    SUM(total_price) AS total_spent,
    ROW_NUMBER() OVER (
      PARTITION BY company_id, period_key, user_id
      ORDER BY SUM(total_price) DESC, dashboard_category ASC
    ) AS category_rank
  FROM public.dashboard_receipt_items_periodized
  GROUP BY company_id, period_key, user_id, dashboard_category
)
SELECT
  dashboard_receipts_periodized.company_id,
  dashboard_receipts_periodized.period_key,
  dashboard_receipts_periodized.user_id,
  dashboard_receipts_periodized.user_name,
  COUNT(DISTINCT dashboard_receipts_periodized.receipt_id) AS receipt_count,
  SUM(dashboard_receipts_periodized.total_amount) AS total_spent,
  COALESCE(top_categories.dashboard_category, 'other') AS top_category
FROM public.dashboard_receipts_periodized
LEFT JOIN category_totals AS top_categories
  ON top_categories.company_id = dashboard_receipts_periodized.company_id
 AND top_categories.period_key = dashboard_receipts_periodized.period_key
 AND top_categories.user_id = dashboard_receipts_periodized.user_id
 AND top_categories.category_rank = 1
GROUP BY
  dashboard_receipts_periodized.company_id,
  dashboard_receipts_periodized.period_key,
  dashboard_receipts_periodized.user_id,
  dashboard_receipts_periodized.user_name,
  top_categories.dashboard_category;

CREATE VIEW public.dashboard_products AS
SELECT
  company_id,
  period_key,
  normalized_description AS product_name,
  COUNT(item_id) AS purchase_count,
  COUNT(DISTINCT user_id) AS employee_count,
  SUM(quantity) AS total_quantity,
  SUM(total_price) AS total_spent,
  MIN(unit_price) AS min_unit_price,
  MAX(unit_price) AS max_unit_price
FROM public.dashboard_receipt_items_periodized
GROUP BY company_id, period_key, normalized_description;

CREATE VIEW public.dashboard_category_spend AS
WITH totals AS (
  SELECT
    company_id,
    period_key,
    dashboard_category AS category,
    SUM(total_price) AS total_spent
  FROM public.dashboard_receipt_items_periodized
  GROUP BY company_id, period_key, dashboard_category
)
SELECT
  totals.category,
  totals.company_id,
  totals.period_key,
  totals.total_spent,
  CASE
    WHEN SUM(totals.total_spent) OVER (PARTITION BY totals.company_id, totals.period_key) > 0
      THEN totals.total_spent
        / SUM(totals.total_spent) OVER (PARTITION BY totals.company_id, totals.period_key)
    ELSE 0
  END AS ratio
FROM totals;

CREATE VIEW public.dashboard_receipt_history AS
WITH item_counts AS (
  SELECT
    company_id,
    period_key,
    receipt_id,
    COUNT(item_id) AS item_count
  FROM public.dashboard_receipt_items_periodized
  GROUP BY company_id, period_key, receipt_id
),
primary_categories AS (
  SELECT
    company_id,
    period_key,
    receipt_id,
    dashboard_category AS primary_category,
    ROW_NUMBER() OVER (
      PARTITION BY company_id, period_key, receipt_id
      ORDER BY SUM(total_price) DESC, dashboard_category ASC
    ) AS category_rank
  FROM public.dashboard_receipt_items_periodized
  GROUP BY company_id, period_key, receipt_id, dashboard_category
)
SELECT
  receipt_periods.company_id,
  receipt_periods.period_key,
  receipt_periods.created_at,
  receipt_periods.flagged_reason,
  receipt_periods.image_url,
  COALESCE(item_counts.item_count, 0) AS item_count,
  COALESCE(primary_categories.primary_category, 'other') AS primary_category,
  receipt_periods.raw_text,
  receipt_periods.receipt_date,
  receipt_periods.receipt_id,
  receipt_periods.status,
  receipt_periods.total_amount,
  receipt_periods.user_id,
  receipt_periods.user_name,
  receipt_periods.vendor_name,
  receipt_periods.vendor_tax_id,
  receipt_periods.vendor_tax_id_valid
FROM public.dashboard_receipts_periodized AS receipt_periods
LEFT JOIN item_counts
  ON item_counts.company_id = receipt_periods.company_id
 AND item_counts.period_key = receipt_periods.period_key
 AND item_counts.receipt_id = receipt_periods.receipt_id
LEFT JOIN primary_categories
  ON primary_categories.company_id = receipt_periods.company_id
 AND primary_categories.period_key = receipt_periods.period_key
 AND primary_categories.receipt_id = receipt_periods.receipt_id
 AND primary_categories.category_rank = 1;

CREATE VIEW public.dashboard_alerts AS
WITH receipt_periods AS (
  SELECT * FROM public.dashboard_receipts_periodized
),
item_periods AS (
  SELECT * FROM public.dashboard_receipt_items_periodized
),
receipt_category_totals AS (
  SELECT
    company_id,
    period_key,
    receipt_id,
    user_id,
    user_name,
    vendor_name,
    dashboard_category AS category,
    SUM(total_price) AS amount
  FROM item_periods
  GROUP BY company_id, period_key, receipt_id, user_id, user_name, vendor_name, dashboard_category
),
period_category_totals AS (
  SELECT
    company_id,
    period_key,
    dashboard_category AS category,
    SUM(total_price) AS amount
  FROM item_periods
  GROUP BY company_id, period_key, dashboard_category
),
duplicate_groups AS (
  SELECT
    company_id,
    period_key,
    LOWER(vendor_name) AS vendor_key,
    MAX(vendor_name) AS vendor_name,
    total_amount AS amount,
    COUNT(*) AS count_value
  FROM receipt_periods
  GROUP BY company_id, period_key, LOWER(vendor_name), total_amount
  HAVING COUNT(*) >= 2
),
duplicate_users AS (
  SELECT DISTINCT
    duplicate_groups.company_id,
    duplicate_groups.period_key,
    duplicate_groups.vendor_key,
    duplicate_groups.vendor_name,
    duplicate_groups.amount,
    duplicate_groups.count_value,
    receipt_periods.user_id,
    receipt_periods.user_name
  FROM duplicate_groups
  INNER JOIN receipt_periods
    ON receipt_periods.company_id = duplicate_groups.company_id
   AND receipt_periods.period_key = duplicate_groups.period_key
   AND LOWER(receipt_periods.vendor_name) = duplicate_groups.vendor_key
   AND receipt_periods.total_amount = duplicate_groups.amount
),
product_stats AS (
  SELECT
    company_id,
    period_key,
    normalized_description AS product_name,
    COUNT(item_id) AS purchase_count,
    COUNT(DISTINCT user_id) AS employee_count,
    SUM(quantity) AS total_quantity,
    MIN(unit_price) AS min_price,
    MAX(unit_price) AS max_price
  FROM item_periods
  GROUP BY company_id, period_key, normalized_description
),
product_users AS (
  SELECT DISTINCT
    company_id,
    period_key,
    normalized_description AS product_name,
    user_id,
    user_name
  FROM item_periods
),
team_totals AS (
  SELECT
    company_id,
    period_key,
    user_id,
    user_name,
    SUM(total_amount) AS total_spent
  FROM receipt_periods
  GROUP BY company_id, period_key, user_id, user_name
),
team_medians AS (
  SELECT
    company_id,
    period_key,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_spent) AS team_median
  FROM team_totals
  GROUP BY company_id, period_key
),
category_users AS (
  SELECT DISTINCT
    company_id,
    period_key,
    dashboard_category AS category,
    user_id,
    user_name
  FROM item_periods
)
SELECT
  receipt_periods.company_id,
  receipt_periods.period_key,
  'tax:' || receipt_periods.receipt_id::text AS alert_id,
  'tax_invalid'::text AS alert_type,
  CASE
    WHEN receipt_periods.vendor_tax_id = '' THEN 92
    ELSE 88
  END::numeric AS priority,
  receipt_periods.user_id,
  receipt_periods.user_name,
  receipt_periods.receipt_id,
  receipt_periods.vendor_name,
  NULL::text AS product_name,
  NULL::text AS category,
  receipt_periods.total_amount AS amount,
  NULL::numeric AS limit_amount,
  NULL::bigint AS count_value,
  NULL::bigint AS employee_count,
  NULL::numeric AS min_price,
  NULL::numeric AS max_price,
  NULL::numeric AS percent_delta,
  NULL::numeric AS team_median,
  NULL::numeric AS team_total_spent,
  receipt_periods.vendor_tax_id
FROM receipt_periods
WHERE NOT receipt_periods.vendor_tax_id_valid

UNION ALL

SELECT
  receipt_category_totals.company_id,
  receipt_category_totals.period_key,
  'policy:' || receipt_category_totals.receipt_id::text || ':' || receipt_category_totals.category AS alert_id,
  'policy_exceeded'::text AS alert_type,
  (100 + (receipt_category_totals.amount - spend_policies.max_per_transaction))::numeric AS priority,
  receipt_category_totals.user_id,
  receipt_category_totals.user_name,
  receipt_category_totals.receipt_id,
  receipt_category_totals.vendor_name,
  NULL::text AS product_name,
  receipt_category_totals.category,
  receipt_category_totals.amount,
  spend_policies.max_per_transaction AS limit_amount,
  NULL::bigint AS count_value,
  NULL::bigint AS employee_count,
  NULL::numeric AS min_price,
  NULL::numeric AS max_price,
  (
    ((receipt_category_totals.amount - spend_policies.max_per_transaction) / spend_policies.max_per_transaction) * 100
  )::numeric AS percent_delta,
  NULL::numeric AS team_median,
  NULL::numeric AS team_total_spent,
  NULL::text AS vendor_tax_id
FROM receipt_category_totals
INNER JOIN public.spend_policies
  ON spend_policies.company_id = receipt_category_totals.company_id
 AND spend_policies.category = receipt_category_totals.category
WHERE spend_policies.max_per_transaction IS NOT NULL
  AND receipt_category_totals.amount > spend_policies.max_per_transaction

UNION ALL

SELECT
  period_category_totals.company_id,
  period_category_totals.period_key,
  'policy-month:' || period_category_totals.category AS alert_id,
  'policy_monthly_exceeded'::text AS alert_type,
  (95 + (period_category_totals.amount - spend_policies.max_per_month))::numeric AS priority,
  category_users.user_id,
  category_users.user_name,
  NULL::uuid AS receipt_id,
  NULL::text AS vendor_name,
  NULL::text AS product_name,
  period_category_totals.category,
  period_category_totals.amount,
  spend_policies.max_per_month AS limit_amount,
  NULL::bigint AS count_value,
  NULL::bigint AS employee_count,
  NULL::numeric AS min_price,
  NULL::numeric AS max_price,
  (
    ((period_category_totals.amount - spend_policies.max_per_month) / spend_policies.max_per_month) * 100
  )::numeric AS percent_delta,
  NULL::numeric AS team_median,
  NULL::numeric AS team_total_spent,
  NULL::text AS vendor_tax_id
FROM period_category_totals
INNER JOIN public.spend_policies
  ON spend_policies.company_id = period_category_totals.company_id
 AND spend_policies.category = period_category_totals.category
INNER JOIN category_users
  ON category_users.company_id = period_category_totals.company_id
 AND category_users.period_key = period_category_totals.period_key
 AND category_users.category = period_category_totals.category
WHERE spend_policies.max_per_month IS NOT NULL
  AND period_category_totals.amount > spend_policies.max_per_month

UNION ALL

SELECT
  item_periods.company_id,
  item_periods.period_key,
  'personal:' || item_periods.item_id::text AS alert_id,
  'personal_purchase'::text AS alert_type,
  (70 + item_periods.total_price)::numeric AS priority,
  item_periods.user_id,
  item_periods.user_name,
  item_periods.receipt_id,
  item_periods.vendor_name,
  item_periods.normalized_description AS product_name,
  item_periods.dashboard_category AS category,
  item_periods.total_price AS amount,
  NULL::numeric AS limit_amount,
  NULL::bigint AS count_value,
  NULL::bigint AS employee_count,
  NULL::numeric AS min_price,
  NULL::numeric AS max_price,
  NULL::numeric AS percent_delta,
  NULL::numeric AS team_median,
  NULL::numeric AS team_total_spent,
  NULL::text AS vendor_tax_id
FROM item_periods
WHERE item_periods.source_text ~ '(personal|cosmetic|beauty|makeup|perfume|shampoo|conditioner|deodorant|toothpaste|toothbrush|razor|skincare|pet|baby|diaper|toy|alcohol|beer|wine|cigarette|tobacco|pharmacy|medicine|medication|clothing|shirt|shoe|pessoal|cosmetico|cosmético|beleza|desodorante|escova de dente|pasta de dente|barbeador|pele|bebe|bebê|fralda|brinquedo|cerveja|vinho|cigarro|tabaco|farmacia|farmácia|remedio|remédio|medicamento|roupa|camisa|sapato)'

UNION ALL

SELECT
  duplicate_users.company_id,
  duplicate_users.period_key,
  'duplicate:' || duplicate_users.vendor_key || ':' || duplicate_users.amount::text AS alert_id,
  'duplicate_receipts'::text AS alert_type,
  (85 + duplicate_users.count_value * 5)::numeric AS priority,
  duplicate_users.user_id,
  duplicate_users.user_name,
  NULL::uuid AS receipt_id,
  duplicate_users.vendor_name,
  NULL::text AS product_name,
  NULL::text AS category,
  duplicate_users.amount,
  NULL::numeric AS limit_amount,
  duplicate_users.count_value,
  NULL::bigint AS employee_count,
  NULL::numeric AS min_price,
  NULL::numeric AS max_price,
  NULL::numeric AS percent_delta,
  NULL::numeric AS team_median,
  NULL::numeric AS team_total_spent,
  NULL::text AS vendor_tax_id
FROM duplicate_users

UNION ALL

SELECT
  product_stats.company_id,
  product_stats.period_key,
  'bulk:' || LOWER(product_stats.product_name) AS alert_id,
  'bulk_buying'::text AS alert_type,
  (60 + product_stats.purchase_count * 4)::numeric AS priority,
  product_users.user_id,
  product_users.user_name,
  NULL::uuid AS receipt_id,
  NULL::text AS vendor_name,
  product_stats.product_name,
  NULL::text AS category,
  NULL::numeric AS amount,
  NULL::numeric AS limit_amount,
  product_stats.purchase_count,
  product_stats.employee_count,
  NULL::numeric AS min_price,
  NULL::numeric AS max_price,
  NULL::numeric AS percent_delta,
  NULL::numeric AS team_median,
  NULL::numeric AS team_total_spent,
  NULL::text AS vendor_tax_id
FROM product_stats
INNER JOIN product_users
  ON product_users.company_id = product_stats.company_id
 AND product_users.period_key = product_stats.period_key
 AND product_users.product_name = product_stats.product_name
WHERE product_stats.purchase_count >= 4
  AND product_stats.employee_count >= 2
  AND product_stats.total_quantity <= product_stats.purchase_count * 3

UNION ALL

SELECT
  product_stats.company_id,
  product_stats.period_key,
  'price:' || LOWER(product_stats.product_name) AS alert_id,
  'price_range'::text AS alert_type,
  (65 + (product_stats.max_price - product_stats.min_price))::numeric AS priority,
  product_users.user_id,
  product_users.user_name,
  NULL::uuid AS receipt_id,
  NULL::text AS vendor_name,
  product_stats.product_name,
  NULL::text AS category,
  NULL::numeric AS amount,
  NULL::numeric AS limit_amount,
  NULL::bigint AS count_value,
  product_stats.employee_count,
  product_stats.min_price,
  product_stats.max_price,
  (((product_stats.max_price - product_stats.min_price) / product_stats.min_price) * 100)::numeric AS percent_delta,
  NULL::numeric AS team_median,
  NULL::numeric AS team_total_spent,
  NULL::text AS vendor_tax_id
FROM product_stats
INNER JOIN product_users
  ON product_users.company_id = product_stats.company_id
 AND product_users.period_key = product_stats.period_key
 AND product_users.product_name = product_stats.product_name
WHERE product_stats.employee_count >= 2
  AND product_stats.purchase_count >= 2
  AND product_stats.min_price > 0
  AND product_stats.max_price >= product_stats.min_price * 1.35
  AND product_stats.max_price - product_stats.min_price >= 5

UNION ALL

SELECT
  team_totals.company_id,
  team_totals.period_key,
  'peer:' || team_totals.user_id::text AS alert_id,
  'peer_overspend'::text AS alert_type,
  (75 + (team_totals.total_spent - team_medians.team_median))::numeric AS priority,
  team_totals.user_id,
  team_totals.user_name,
  NULL::uuid AS receipt_id,
  NULL::text AS vendor_name,
  NULL::text AS product_name,
  NULL::text AS category,
  NULL::numeric AS amount,
  NULL::numeric AS limit_amount,
  NULL::bigint AS count_value,
  NULL::bigint AS employee_count,
  NULL::numeric AS min_price,
  NULL::numeric AS max_price,
  (((team_totals.total_spent - team_medians.team_median) / team_medians.team_median) * 100)::numeric AS percent_delta,
  team_medians.team_median,
  team_totals.total_spent AS team_total_spent,
  NULL::text AS vendor_tax_id
FROM team_totals
INNER JOIN team_medians
  ON team_medians.company_id = team_totals.company_id
 AND team_medians.period_key = team_totals.period_key
WHERE team_medians.team_median > 0
  AND team_totals.total_spent > team_medians.team_median * 1.75
  AND team_totals.total_spent - team_medians.team_median >= 100;
