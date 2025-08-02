'use client';

import React, { useState, useMemo } from 'react';
import { DataGrid, DataGridColumn } from './DataGrid';

// Example data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

// Example data
const mockUsers: User[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Manager' : 'User',
  status: i % 4 === 0 ? 'inactive' : 'active',
}));

// Column definitions
const columns: DataGridColumn<User>[] = [
  {
    header: 'ID',
    field: 'id',
    isSortable: true,
  },
  {
    header: 'Name',
    field: 'name',
    isSortable: true,
  },
  {
    header: 'Email',
    field: 'email',
    isSortable: true,
  },
  {
    header: 'Role',
    field: 'role',
    isSortable: true,
  },
  {
    header: 'Status',
    field: 'status',
    isSortable: true,
    displayCell: (row) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

export function DataGridPaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const pageSize = 10;

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField) return mockUsers;

    return [...mockUsers].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortField, sortDirection]);

  // Get current page data
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field: keyof User, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        DataGrid with Pagination Example
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, mockUsers.length)} of{' '}
          {mockUsers.length} users
        </p>
      </div>

      <DataGrid
        columns={columns}
        data={currentPageData}
        onSort={handleSort}
        pagination={{
          currentPage,
          pageSize,
          totalItems: mockUsers.length,
          onPageChange: handlePageChange,
          showPagination: true,
        }}
        className="border border-gray-200 rounded-lg"
      />
    </div>
  );
}

export default DataGridPaginationExample;
