/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const TableTemplate = ({ buttonHaver: ButtonHaver, columns, rows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedRows = rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const pageCount = Math.ceil(rows.length / rowsPerPage);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-indigo-900 text-white text-left text-sm font-semibold">
            {columns.map((column) => (
              <th
                key={column.id}
                className={`py-3 px-4 min-w-[${column.minWidth || 100}px]`}
              >
                {column.label}
              </th>
            ))}
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-100 text-sm border-b border-gray-200"
            >
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <td key={column.id} className="py-3 px-4 text-gray-800">
                    {column.format && typeof value === "number"
                      ? column.format(value)
                      : value}
                  </td>
                );
              })}
              <td className="py-3 px-4 text-center">
                <ButtonHaver row={row} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 text-sm">
        <div>
          Showing {page * rowsPerPage + 1}–
          {Math.min((page + 1) * rowsPerPage, rows.length)} of {rows.length}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page + 1} of {pageCount}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, pageCount - 1))}
            disabled={page >= pageCount - 1}
            className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            className="ml-2 px-2 py-1 border border-gray-300 rounded"
          >
            {[5, 10, 25, 100].map((size) => (
              <option key={size} value={size}>
                {size}/page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TableTemplate;
