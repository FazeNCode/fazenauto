'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import styles from './VehicleTable.module.css';

export default function VehicleTable({ 
  vehicles, 
  loading, 
  error, 
  filters, 
  setFilters, 
  onDelete, 
  onRefresh 
}) {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(() => [
    {
      accessorKey: 'images',
      header: 'Image',
      cell: ({ getValue }) => {
        const images = getValue();
        const firstImage = images && images.length > 0 ? images[0] : null;
        return (
          <div className={styles.imageCell}>
            {firstImage ? (
              <Image
                src={firstImage}
                alt="Vehicle"
                width={80}
                height={60}
                className={styles.vehicleImage}
              />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'year',
      header: 'Year',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'make',
      header: 'Make',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'model',
      header: 'Model',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ getValue }) => {
        const price = getValue();
        return price ? `$${Number(price).toLocaleString()}` : 'N/A';
      },
    },
    {
      accessorKey: 'mileage',
      header: 'Mileage',
      cell: ({ getValue }) => {
        const mileage = getValue();
        return mileage ? `${Number(mileage).toLocaleString()} mi` : 'N/A';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() || 'draft';
        return (
          <span className={`${styles.status} ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const vehicle = row.original;
        return (
          <div className={styles.actions}>
            <Link 
              href={`/admin/vehicles/edit/${vehicle._id}`}
              className={styles.editBtn}
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(vehicle._id)}
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ], [onDelete]);

  const table = useReactTable({
    data: vehicles,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return <div className={styles.loading}>Loading vehicles...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={onRefresh} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by VIN, make, model..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className={styles.searchInput}
        />
        
        <select
          value={filters.make}
          onChange={(e) => setFilters({ ...filters, make: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="">All Makes</option>
          {[...new Set(vehicles.map(v => v.make).filter(Boolean))].map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="sold">Sold</option>
        </select>

        <button onClick={onRefresh} className={styles.refreshBtn}>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className={styles.th}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={header.column.getCanSort() ? styles.sortable : ''}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className={styles.tr}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          className={styles.pageBtn}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={styles.pageBtn}
        >
          {'<'}
        </button>
        <span className={styles.pageInfo}>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={styles.pageBtn}
        >
          {'>'}
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          className={styles.pageBtn}
        >
          {'>>'}
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className={styles.pageSizeSelect}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
