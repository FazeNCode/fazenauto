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
import Link from 'next/link';
import styles from './VehicleTable.module.css';

export default function VehicleTable({
  vehicles,
  loading,
  error,
  filters,
  setFilters,
  onDelete,
  onRefresh,
  selectedVehicles = [],
  setSelectedVehicles = () => {},
  showSelection = false
}) {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Handle delete click
  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  // Handle sold click
  const handleSoldClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowSoldModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedVehicle) return;

    setActionLoading(true);
    try {
      await onDelete(selectedVehicle._id);
      setShowDeleteModal(false);
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm sold
  const confirmSold = async () => {
    if (!selectedVehicle) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/vehicles/${selectedVehicle._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'sold' }),
      });

      if (res.ok) {
        onRefresh(); // Refresh the table
        setShowSoldModal(false);
        setSelectedVehicle(null);
      } else {
        throw new Error('Failed to mark vehicle as sold');
      }
    } catch (error) {
      console.error('Mark as sold failed:', error);
      alert('Error marking vehicle as sold: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel modals
  const cancelAction = () => {
    setShowDeleteModal(false);
    setShowSoldModal(false);
    setSelectedVehicle(null);
  };

  // Handle vehicle selection
  const handleSelectVehicle = (vehicleId, isSelected) => {
    if (isSelected) {
      setSelectedVehicles(prev => [...prev, vehicleId]);
    } else {
      setSelectedVehicles(prev => prev.filter(id => id !== vehicleId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedVehicles(vehicles.map(v => v._id));
    } else {
      setSelectedVehicles([]);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [];

    // Add selection column if showSelection is true
    if (showSelection) {
      baseColumns.push({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={selectedVehicles.length === vehicles.length && vehicles.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className={styles.selectCheckbox}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedVehicles.includes(row.original._id)}
            onChange={(e) => handleSelectVehicle(row.original._id, e.target.checked)}
            className={styles.selectCheckbox}
          />
        ),
      });
    }

    baseColumns.push({
      accessorKey: 'images',
      header: 'Image',
      cell: ({ row }) => {
        const vehicle = row.original;
        // Try images array first, then fall back to imageUrl for backward compatibility
        const images = vehicle.images;
        const imageUrl = vehicle.imageUrl;
        const firstImage = (images && images.length > 0) ? images[0] : imageUrl;

        return (
          <div className={styles.imageCell}>
            {firstImage ? (
              <img
                src={firstImage}
                alt="Vehicle"
                width={80}
                height={60}
                className={styles.vehicleImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
            <div className={styles.noImage} style={{ display: 'none' }}>
              No Image
            </div>
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
            {vehicle.status !== 'sold' && (
              <button
                onClick={() => handleSoldClick(vehicle)}
                className={styles.soldBtn}
                disabled={actionLoading}
              >
                Sold
              </button>
            )}
            <button
              onClick={() => handleDeleteClick(vehicle)}
              className={styles.deleteBtn}
              disabled={actionLoading}
            >
              Delete
            </button>
          </div>
        );
      },
    });

    return baseColumns;
  }, [actionLoading, showSelection, selectedVehicles, vehicles]);

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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this vehicle?<br />
              <strong>{selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}</strong>
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={confirmDelete}
                className={styles.confirmBtn}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={cancelAction}
                className={styles.cancelBtn}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sold Confirmation Modal */}
      {showSoldModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Mark as Sold</h3>
            <p>
              Are you sure you want to move this vehicle to sold?<br />
              <strong>{selectedVehicle?.year} {selectedVehicle?.make} {selectedVehicle?.model}</strong>
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={confirmSold}
                className={styles.confirmBtn}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Yes, Mark as Sold'}
              </button>
              <button
                onClick={cancelAction}
                className={styles.cancelBtn}
                disabled={actionLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
