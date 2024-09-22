"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import React from "react"
import { Input } from "./input"
import { DataTablePagination } from "./data-table/pagination"
import { DataTableViewOptions } from "./data-table/view-option"
import { useRouter } from "next/navigation"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  getRowHref?: (row: TData) => void
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  onSortChange: (field: string, direction: 'asc' | 'desc') => void
  onFilterChange: (columnId: string, value: string) => void
  pageCount: number
  pageIndex: number
  pageSize: number
  sortField?: string
  sortDirection?: 'asc' | 'desc'
  filters: Record<string, string>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowHref,
  onPaginationChange,
  onSortChange,
  onFilterChange,
  pageCount,
  pageIndex,
  pageSize,
  sortField,
  sortDirection,
  filters,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const router = useRouter()

  React.useEffect(() => {
    if (sortField && sortDirection) {
      setSorting([{ id: sortField, desc: sortDirection === 'desc' }])
    }
  }, [sortField, sortDirection])

  React.useEffect(() => {
    const newColumnFilters = Object.entries(filters).map(([key, value]) => ({
      id: key,
      value: value,
    }))
    setColumnFilters(newColumnFilters)
  }, [filters])

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater({
          pageIndex,
          pageSize,
        })
        onPaginationChange(newPagination.pageIndex, newPagination.pageSize)
      } else {
        onPaginationChange(updater.pageIndex, updater.pageSize)
      }
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      if (newSorting.length > 0) {
        const { id, desc } = newSorting[0]
        onSortChange(id, desc ? 'desc' : 'asc')
      } else {
        onSortChange('', 'asc')
      }
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater
      setColumnFilters(newFilters)
      // biome-ignore lint/complexity/noForEach: <explanation>
      newFilters.forEach((filter) => {
        onFilterChange(filter.id, filter.value as string)
      })
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  const handleRowClick = (row: TData) => {
    if (getRowHref) {
      // const href = 
      getRowHref(row)
      // router.push(href)
    }
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border mb-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer hover:bg-muted/50 hover:cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}