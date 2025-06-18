import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  Paper,
} from '@mui/material';
import { StyledTableCell, StyledTableRow } from './styles';

const TableViewTemplate = ({ columns, rows }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <Paper elevation={2} className="rounded-xl border border-gray-200 shadow-md">
        <TableContainer>
          <Table stickyHeader aria-label="notice table">
            <TableHead>
              <StyledTableRow>
                {columns.map((column, index) => (
                  <StyledTableCell
                    key={index}
                    align={column.align || 'left'}
                    style={{
                      minWidth: column.minWidth || 100,
                      backgroundColor: 'blue',
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                    }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <StyledTableCell key={index} align={column.align || 'left'}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2">
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            className="text-gray-700"
          />
        </div>
      </Paper>
    </div>
  );
};

export default TableViewTemplate;
