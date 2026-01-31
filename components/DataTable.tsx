"use client";

import { ReactNode } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface Action<T> {
  icon: ReactNode;
  label: string;
  onClick: (item: T) => void;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  actions,
  emptyMessage = "No data available",
  loading = false,
  onRowClick
}: DataTableProps<T>) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'shortlisted':
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'paused':
      case 'reviewed':
      case 'interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'submitted':
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12">
        <div className="text-center">
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.className || ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const itemId = item.id || index;
              return (
                <tr
                  key={itemId}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap ${
                        column.className || ''
                      }`}
                    >
                      {column.render ? (
                        column.render(item)
                      ) : (
                        <div className="text-sm text-gray-900">
                          {/* Auto-render if key exists in item */}
                          {(item as any)[column.key] !== undefined ? (
                            column.key.toLowerCase().includes('status') ? (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                  String((item as any)[column.key])
                                )}`}
                              >
                                {(item as any)[column.key]}
                              </span>
                            ) : (
                              String((item as any)[column.key])
                            )
                          ) : (
                            '-'
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(item);
                            }}
                            className={action.className || "text-gray-600 hover:text-gray-900"}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

