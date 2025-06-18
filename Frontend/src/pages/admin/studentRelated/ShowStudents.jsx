import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";

import { getAllStudents } from "../../../redux/studentRelated/studentHandle";
import { deleteUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const { studentsList, loading } = useSelector((state) => state.student);
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;

  // Local states
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const rowsPerPage = 10;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllStudents(adminID));
    }
  }, [adminID, dispatch]);

  const deleteHandler = async (deleteID, address) => {
    setDeleting(true);
    try {
      await dispatch(deleteUser(deleteID, address));
      await dispatch(getAllStudents(adminID));
    } catch (err) {
      setMessage(`Error deleting student: ${err.message || err}`);
      setShowPopup(true);
    } finally {
      setDeleting(false);
    }
  };

  // Prepare rows
  const studentRows = Array.isArray(studentsList)
    ? studentsList.map((s) => ({
        name: s.name,
        rollNum: s.rollNum,
        className: s.sclassName?.sclassName || "N/A",
        id: s._id,
      }))
    : [];

  // Normalize search term once
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  // Filter rows by search term safely
  const filteredRows = studentRows.filter((row) =>
    [row.name, row.rollNum, row.className].some((field) =>
      String(field).toLowerCase().includes(normalizedSearchTerm)
    )
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getPaginationRange = () => {
    const totalPageButtons = 5;
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = startPage + totalPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - totalPageButtons + 1, 1);
    }

    const range = [];
    for (let i = startPage; i <= endPage; i++) range.push(i);
    return range;
  };

  const paginationRange = getPaginationRange();

  // Action menu component for each student row
  const StudentActionMenu = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const menuRef = useRef(null);
    const open = Boolean(anchorEl);
    const options = ["Take Attendance", "Provide Marks"];

    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    useEffect(() => {
      function handleKeyDown(event) {
        if (event.key === "Escape") {
          handleMenuClose();
        }
      }
      if (open) {
        document.addEventListener("keydown", handleKeyDown);
      }
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open]);

    useEffect(() => {
      function handleClickOutside(event) {
        if (
          anchorEl &&
          !anchorEl.contains(event.target) &&
          menuRef.current &&
          !menuRef.current.contains(event.target)
        ) {
          setAnchorEl(null);
        }
      }
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [anchorEl, open]);

    const handleMenuItemClick = (option) => {
      handleMenuClose();
      if (option === "Take Attendance") {
        navigate(`/Admin/students/student/attendance/${row.id}`);
      } else {
        navigate(`/Admin/students/student/marks/${row.id}`);
      }
    };

    return (
      <div className="flex items-center gap-2 relative">
        {/* Delete button */}
        <button
          onClick={() => deleteHandler(row.id, "Student")}
          disabled={deleting}
          className="relative group p-1 rounded-md text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Delete student"
          type="button"
        >
          <PersonRemoveIcon className="h-5 w-5" />
          <span className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 rounded bg-gray-900 px-2 py-1 text-xs text-white transition-all group-hover:scale-100 whitespace-nowrap pointer-events-none">
            Delete Student
          </span>
        </button>

        {/* View button */}
        <button
          onClick={() => navigate(`/Admin/students/student/${row.id}`)}
          className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
        >
          View
        </button>

        {/* 3-dot menu button */}
        <button
          onClick={handleMenuClick}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          aria-controls={open ? "student-menu" : undefined}
          id="student-button"
          className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="button"
          aria-label="Open action menu"
        >
          <MoreVertIcon className="h-6 w-6 text-gray-700" />
        </button>

        {/* Dropdown menu */}
        {open && (
          <ul
            ref={menuRef}
            id="student-menu"
            role="menu"
            aria-labelledby="student-button"
            className="absolute top-full mt-1 right-0 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10"
          >
            {options.map((option) => (
              <li
                key={option}
                role="menuitem"
                tabIndex={0}
                onClick={() => handleMenuItemClick(option)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleMenuItemClick(option)
                }
                className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-100"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Search Input */}
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by name, roll number or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md w-full"
            InputProps={{ className: "text-gray-800" }}
            aria-label="Search students"
          />
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/Admin/addstudents")}
              type="button"
              className="inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition"
            >
              Add New Student
            </button>

            <button
              onClick={() => deleteHandler(adminID, "Students")}
              disabled={deleting}
              className="inline-flex items-center bg-red-100 text-red-700 hover:bg-red-200 px-5 py-2 rounded-md font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Delete all students"
              type="button"
            >
              <PersonRemoveIcon fontSize="small" className="mr-2" />
              Delete All Students
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-lg font-medium text-gray-500 py-16">
            Loading...
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-lg font-medium select-none">
            No students found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-300 text-sm text-gray-800">
                <thead className="bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Roll Number</th>
                    <th className="px-6 py-3 text-left">Class</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedRows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.rollNum}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.className}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <StudentActionMenu row={row} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav
              className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-300 mt-6 rounded-b-lg"
              aria-label="Table navigation"
            >
              <span className="text-sm text-gray-600 mb-4 sm:mb-0 select-none">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {(currentPage - 1) * rowsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900">
                  {Math.min(currentPage * rowsPerPage, filteredRows.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {filteredRows.length}
                </span>{" "}
                students
              </span>

              <ul className="inline-flex items-center space-x-1 text-sm">
                <li>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="px-4 py-2 border rounded-l-md bg-white text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    type="button"
                  >
                    Previous
                  </button>
                </li>

                {/* First page & ellipsis */}
                {paginationRange[0] > 1 && (
                  <>
                    <li>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className={`px-4 py-2 border ${
                          currentPage === 1
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        aria-current={currentPage === 1 ? "page" : undefined}
                        type="button"
                      >
                        1
                      </button>
                    </li>
                    {paginationRange[0] > 2 && (
                      <li>
                        <span className="px-2 py-2 text-gray-400 select-none">
                          ...
                        </span>
                      </li>
                    )}
                  </>
                )}

                {/* Page buttons */}
                {paginationRange.map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 border ${
                        page === currentPage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 hover:bg-gray-100"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      aria-current={page === currentPage ? "page" : undefined}
                      type="button"
                    >
                      {page}
                    </button>
                  </li>
                ))}

                {/* Last page & ellipsis */}
                {paginationRange[paginationRange.length - 1] < totalPages && (
                  <>
                    {paginationRange[paginationRange.length - 1] <
                      totalPages - 1 && (
                      <li>
                        <span className="px-2 py-2 text-gray-400 select-none">
                          ...
                        </span>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-4 py-2 border ${
                          currentPage === totalPages
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        aria-current={currentPage === totalPages ? "page" : undefined}
                        type="button"
                      >
                        {totalPages}
                      </button>
                    </li>
                  </>
                )}

                <li>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className="px-4 py-2 border rounded-r-md bg-white text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Next page"
                    disabled={currentPage === totalPages}
                    type="button"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </>
        )}

        {/* Popup for messages */}
        {showPopup && (
          <Popup
            message={message}
            onClose={() => setShowPopup(false)}
            closeButtonText="Close"
          />
        )}
      </div>
    </div>
  );
};

export default ShowStudents;