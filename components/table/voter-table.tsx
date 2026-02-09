'use client'

import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown, User, Users, MapPin, Briefcase, Calendar, Hash } from 'lucide-react'
import type { VoterRecord } from '@/lib/types'

interface VoterTableProps {
  data: VoterRecord[]
}

export function VoterTable({ data }: VoterTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  })

  const columns = useMemo<ColumnDef<VoterRecord>[]>(
    () => [
      {
        accessorKey: 'sl_no',
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto px-2 text-white hover:bg-slate-600 hover:text-white font-semibold flex items-center gap-2 rounded transition-colors"
            >
              <div className="text-center">
                <div>ক্রমিক</div>
                <div className="text-xs opacity-90">SL No</div>
              </div>
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-60" />
              )}
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-semibold text-blue-600 text-center">{row.original.sl_no}</div>
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto px-2 text-white hover:bg-slate-600 hover:text-white font-semibold flex items-center gap-2 rounded transition-colors"
            >
              <div className="text-center">
                <div>নাম</div>
                <div className="text-xs opacity-90">Name</div>
              </div>
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-60" />
              )}
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-semibold text-gray-900">{row.original.name}</div>
        ),
      },
      {
        accessorKey: 'voter_no',
        header: () => (
          <div className="text-center">
            <div>ভোটার নম্বর</div>
            <div className="text-xs opacity-90">Voter ID</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-sm bg-blue-50 px-2 py-1 rounded border border-blue-200">
            {row.original.voter_no}
          </div>
        ),
      },
      {
        accessorKey: 'father_name',
        header: () => (
          <div className="text-center">
            <div>পিতার নাম</div>
            <div className="text-xs opacity-90">Father</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-gray-800">{row.original.father_name}</div>
        ),
      },
      {
        accessorKey: 'mother_name',
        header: () => (
          <div className="text-center">
            <div>মাতার নাম</div>
            <div className="text-xs opacity-90">Mother</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-gray-800">{row.original.mother_name}</div>
        ),
      },
      {
        accessorKey: 'occupation',
        header: () => (
          <div className="text-center">
            <div>পেশা</div>
            <div className="text-xs opacity-90">Occupation</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            {row.original.occupation}
          </div>
        ),
      },
      {
        accessorKey: 'dob',
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto px-2 text-white hover:bg-slate-600 hover:text-white font-semibold flex items-center gap-2 rounded transition-colors"
            >
              <div className="text-center">
                <div>জন্ম তারিখ</div>
                <div className="text-xs opacity-90">Date of Birth</div>
              </div>
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUpDown className="h-4 w-4 opacity-60" />
              )}
            </button>
          )
        },
        cell: ({ row }) => (
          <div className="font-mono text-sm bg-green-50 px-2 py-1 rounded border border-green-200 inline-block">
            {row.original.dob}
          </div>
        ),
      },
      {
        accessorKey: 'address',
        header: () => (
          <div className="text-center">
            <div>ঠিকানা</div>
            <div className="text-xs opacity-90">Address</div>
          </div>
        ),
        cell: ({ row }) => (
          <div className="max-w-md text-sm leading-relaxed text-gray-700" title={row.original.address}>
            <div className="line-clamp-2">{row.original.address}</div>
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  })

  const currentPageData = table.getRowModel().rows

  return (
    <div className="space-y-4">
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block rounded-lg border-2 border-gray-200 bg-white overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
              {currentPageData?.length ? (
                currentPageData.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
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
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No voters found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View - Hidden on Desktop */}
      <div className="md:hidden space-y-4">
        {currentPageData?.length ? (
          currentPageData.map((row) => {
            const voter = row.original
            return (
              <Card key={row.id} className="p-4 hover:shadow-xl transition-all duration-200 border-2 border-gray-200 hover:border-blue-300 bg-white">
                <div className="space-y-3">
                  {/* Header with Name and SL No */}
                  <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-2.5">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">{voter.name}</h3>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="bg-slate-800 text-white px-2.5 py-1 rounded-md text-center min-w-[55px]">
                        <div className="text-[9px] font-medium opacity-80 leading-tight">ক্রমিক নং</div>
                        <div className="text-sm font-bold leading-tight">{voter.sl_no}</div>
                      </div>
                    </div>
                  </div>

                  {/* Voter Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <Hash className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 font-medium mb-0.5">ভোটার নম্বর • Voter ID</p>
                        <p className="font-mono text-xs font-semibold text-gray-900">{voter.voter_no}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <Users className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 font-medium mb-0.5">পিতা-মাতা • Parents</p>
                        <p className="text-xs font-medium text-gray-800">পিতা: {voter.father_name}</p>
                        <p className="text-xs font-medium text-gray-800">মাতা: {voter.mother_name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <Briefcase className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 font-medium mb-0.5">পেশা • Occupation</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-800">
                          {voter.occupation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <Calendar className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 font-medium mb-0.5">জন্ম তারিখ • Date of Birth</p>
                        <p className="font-mono text-xs font-semibold text-gray-800">{voter.dob}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 font-medium mb-0.5">ঠিকানা • Address</p>
                        <p className="text-xs font-medium leading-relaxed text-gray-800">{voter.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <Card className="p-12">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">No voters found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          </Card>
        )}
      </div>

      {/* Pagination - Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 bg-white rounded-lg border-2 border-gray-200 p-4 shadow-md">
        <div className="text-sm font-medium text-gray-700 text-center sm:text-left">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              data.length
            )}{' '}
            of {data.length} results
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Rows per page:</label>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="border-2 border-blue-300 rounded-lg px-3 py-1.5 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[25, 50, 100, 200].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-24 font-semibold border-2 hover:bg-blue-50 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-24 font-semibold border-2 hover:bg-blue-50 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
