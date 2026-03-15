import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import type {
  DashboardEmployeeRow,
  DashboardReceiptRow,
} from "@/features/dashboard/server"
import { DASHBOARD_CATEGORY_OPTIONS } from "@/features/dashboard/model"
import {
  SortableHeader,
  TablePagination,
  formatDate,
  formatDateTime,
  formatReceiptCode,
} from "@/features/dashboard/ui"
import { currencyFormatter, numberFormatter } from "@/lib/i18n"

type EmployeeSpendTableRow = {
  alertCount: number
  receiptCount: number
  topCategory: string
  totalSpent: number
  userId: string
  userName: string
}

type ReceiptHistoryTableRow = {
  amount: number
  categoryKey: string
  categoryLabel: string
  id: string
  itemCount: number
  printedAt: string
  receiptCode: string
  uploadedAt: string | null
  userName: string
  vendorName: string
}

export function EmployeeSpendTable({
  employees,
  onSelectEmployee,
}: {
  employees: Array<DashboardEmployeeRow>
  onSelectEmployee: (employeeId: string) => void
}) {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = React.useState("")
  const deferredSearchValue = React.useDeferredValue(searchValue)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "totalSpent", desc: true },
  ])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8,
  })

  const rows = React.useMemo<Array<EmployeeSpendTableRow>>(
    () =>
      employees.map((employee) => ({
        alertCount: employee.alertCount,
        receiptCount: employee.receiptCount,
        topCategory: employee.topCategory,
        totalSpent: employee.totalSpent,
        userId: employee.userId,
        userName: employee.userName,
      })),
    [employees]
  )

  const columns = React.useMemo<Array<ColumnDef<EmployeeSpendTableRow>>>(
    () => [
      {
        accessorKey: "userName",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.employee")}
          />
        ),
        cell: ({ row }) => (
          <div className="min-w-[12rem]">
            <p className="font-display text-base font-bold text-text-primary">
              {row.original.userName}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "receiptCount",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.receipts")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-primary">
            {numberFormatter.format(row.original.receiptCount)}
          </span>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: ({ column }) => (
          <SortableHeader column={column} label={t("dashboard.table.total")} />
        ),
        cell: ({ row }) => (
          <span className="font-display text-sm font-bold text-text-primary">
            {currencyFormatter.format(row.original.totalSpent)}
          </span>
        ),
      },
      {
        accessorKey: "topCategory",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.labels.topCategory")}
          />
        ),
        cell: ({ row }) => (
          <span className="inline-flex rounded-full bg-bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">
            {row.original.topCategory}
          </span>
        ),
      },
      {
        accessorKey: "alertCount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <SortableHeader
              column={column}
              label={t("dashboard.table.alerts")}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span
              className={[
                "inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold",
                row.original.alertCount
                  ? "bg-danger/10 text-danger"
                  : "bg-bg-surface text-text-secondary",
              ].join(" ")}
            >
              {row.original.alertCount
                ? numberFormatter.format(row.original.alertCount)
                : t("dashboard.labels.noAlerts")}
            </span>
          </div>
        ),
      },
    ],
    [t]
  )

  const table = useReactTable({
    columns,
    data: rows,
    state: {
      globalFilter: deferredSearchValue,
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).trim().toLowerCase()

      if (!query) {
        return true
      }

      return [row.original.userName, row.original.topCategory]
        .join(" ")
        .toLowerCase()
        .includes(query)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  React.useEffect(() => {
    table.setPageIndex(0)
  }, [deferredSearchValue, table])

  return (
    <div className="space-y-4">
      <label className="block max-w-md space-y-2">
        <span className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
          {t("dashboard.table.searchLabel")}
        </span>
        <span className="relative block">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary"
            size={16}
          />
          <input
            className="w-full rounded-full border border-border/70 bg-bg-base py-3 pr-4 pl-11 text-sm text-text-primary transition outline-none placeholder:text-text-secondary/70 focus:border-accent"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t("dashboard.table.employeeSearchPlaceholder")}
            type="search"
            value={searchValue}
          />
        </span>
      </label>

      <div className="overflow-hidden rounded-[28px] border border-border/60 bg-bg-base/70">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-bg-surface/80">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-border/60 px-4 py-3 text-left first:pl-5 last:pr-5"
                      scope="col"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer transition focus-within:bg-white/70 hover:bg-white/70"
                    onClick={() => onSelectEmployee(row.original.userId)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onSelectEmployee(row.original.userId)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-border/50 px-4 py-4 align-middle first:pl-5 last:pr-5"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-5 py-10 text-center text-sm text-text-secondary"
                    colSpan={columns.length}
                  >
                    {t("dashboard.table.noEmployeeResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TablePagination
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        currentCount={table.getFilteredRowModel().rows.length}
        onNext={() => table.nextPage()}
        onPrevious={() => table.previousPage()}
        pageCount={table.getPageCount()}
        pageIndex={table.getState().pagination.pageIndex}
      />
    </div>
  )
}

export function ReceiptHistoryTable({
  onSelectReceipt,
  receipts,
}: {
  onSelectReceipt: (receiptId: string) => void
  receipts: Array<DashboardReceiptRow>
}) {
  const { t } = useTranslation()
  const [searchValue, setSearchValue] = React.useState("")
  const deferredSearchValue = React.useDeferredValue(searchValue)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "uploadedAt", desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const rows = React.useMemo<Array<ReceiptHistoryTableRow>>(
    () =>
      receipts.map((receipt) => ({
        amount: receipt.totalAmount,
        categoryKey: receipt.primaryCategoryKey,
        categoryLabel: receipt.primaryCategory,
        id: receipt.id,
        itemCount: receipt.itemCount,
        printedAt: receipt.receiptDate,
        receiptCode: formatReceiptCode(receipt.id),
        uploadedAt: receipt.createdAt,
        userName: receipt.userName,
        vendorName: receipt.vendorName,
      })),
    [receipts]
  )

  const columns = React.useMemo<Array<ColumnDef<ReceiptHistoryTableRow>>>(
    () => [
      {
        accessorKey: "receiptCode",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.receipt")}
          />
        ),
        cell: ({ row }) => (
          <div className="min-w-[8rem]">
            <p className="font-display text-sm font-bold tracking-[0.04em] text-text-primary uppercase">
              #{row.original.receiptCode}
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              {numberFormatter.format(row.original.itemCount)}{" "}
              {t("dashboard.labels.items")}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "uploadedAt",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.uploadDateTime")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-primary">
            {formatDateTime(row.original.uploadedAt)}
          </span>
        ),
      },
      {
        accessorKey: "printedAt",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.printedDateTime")}
          />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-primary">
            {formatDate(row.original.printedAt)}
          </span>
        ),
      },
      {
        accessorKey: "userName",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.employee")}
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">
            {row.original.userName}
          </span>
        ),
      },
      {
        accessorKey: "vendorName",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.merchant")}
          />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-text-primary">
            {row.original.vendorName}
          </span>
        ),
      },
      {
        accessorKey: "categoryLabel",
        id: "category",
        header: ({ column }) => (
          <SortableHeader
            column={column}
            label={t("dashboard.table.category")}
          />
        ),
        filterFn: (row, _columnId, value) =>
          !value || row.original.categoryKey === value,
        cell: ({ row }) => (
          <span className="inline-flex rounded-full bg-bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary">
            {row.original.categoryLabel}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <SortableHeader
              column={column}
              label={t("dashboard.table.amount")}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <p className="font-display text-base font-bold text-text-primary">
              {currencyFormatter.format(row.original.amount)}
            </p>
            <p className="text-xs text-text-secondary">
              {t("dashboard.labels.tapForDetail")}
            </p>
          </div>
        ),
      },
    ],
    [t]
  )

  const table = useReactTable({
    columns,
    data: rows,
    state: {
      columnFilters,
      globalFilter: deferredSearchValue,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue).trim().toLowerCase()

      if (!query) {
        return true
      }

      return [
        row.original.id,
        row.original.receiptCode,
        row.original.uploadedAt ?? "",
        formatDateTime(row.original.uploadedAt),
        row.original.printedAt,
        formatDate(row.original.printedAt),
        row.original.userName,
        row.original.vendorName,
        row.original.categoryLabel,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const categoryFilterValue =
    (table.getColumn("category")?.getFilterValue() as string | undefined) ?? ""

  React.useEffect(() => {
    table.setPageIndex(0)
  }, [categoryFilterValue, deferredSearchValue, table])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] lg:w-full lg:max-w-3xl">
          <label className="space-y-2">
            <span className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
              {t("dashboard.table.searchLabel")}
            </span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary"
                size={16}
              />
              <input
                className="w-full rounded-full border border-border/70 bg-bg-base py-3 pr-4 pl-11 text-sm text-text-primary transition outline-none placeholder:text-text-secondary/70 focus:border-accent"
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={t("dashboard.table.searchPlaceholder")}
                type="search"
                value={searchValue}
              />
            </span>
          </label>

          <label className="space-y-2">
            <span className="text-xs font-semibold tracking-[0.12em] text-text-secondary uppercase">
              {t("dashboard.table.categoryFilter")}
            </span>
            <select
              className="w-full rounded-full border border-border/70 bg-bg-base px-4 py-3 text-sm text-text-primary transition outline-none focus:border-accent"
              onChange={(event) =>
                table
                  .getColumn("category")
                  ?.setFilterValue(event.target.value || undefined)
              }
              value={categoryFilterValue}
            >
              <option value="">{t("dashboard.table.allCategories")}</option>
              {DASHBOARD_CATEGORY_OPTIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-sm text-text-secondary">
          {numberFormatter.format(table.getFilteredRowModel().rows.length)}{" "}
          {t("dashboard.labels.receiptCount")}
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-border/60 bg-bg-base/70">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-bg-surface/80">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-border/60 px-4 py-3 text-left first:pl-5 last:pr-5"
                      scope="col"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer transition focus-within:bg-white/70 hover:bg-white/70"
                    onClick={() => onSelectReceipt(row.original.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onSelectReceipt(row.original.id)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="border-b border-border/50 px-4 py-4 align-middle first:pl-5 last:pr-5"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-5 py-10 text-center text-sm text-text-secondary"
                    colSpan={columns.length}
                  >
                    {t("dashboard.table.noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TablePagination
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        currentCount={table.getFilteredRowModel().rows.length}
        onNext={() => table.nextPage()}
        onPrevious={() => table.previousPage()}
        pageCount={table.getPageCount()}
        pageIndex={table.getState().pagination.pageIndex}
      />
    </div>
  )
}
