import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  PersonAddAlt1 as PersonAddIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getAllTeachers } from "../../../redux/teacherRelated/teacherHandle";
import Popup from "../../../components/Popup";

const ShowTeachers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { teachersList, loading, error } = useSelector(
    (state) => state.teacher
  );
  const { currentUser } = useSelector((state) => state.user);
  const userID = currentUser?._id;

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (userID) {
      dispatch(getAllTeachers(userID));
    }
  }, [userID, dispatch]);

  const deleteHandler = async (deleteID, address) => {
    try {
      dispatch(deleteUser(deleteID, address));
      dispatch(getAllTeachers(userID));
    } catch (err) {
      setMessage("Error deleting teacher",err);
      setShowPopup(true);
    }
  };

  const teacherRows = Array.isArray(teachersList)
    ? teachersList.map((teacher) => ({
        id: teacher._id,
        name: teacher.name,
        subject: teacher.teachSubject?.subName || null,
        className: teacher.teachSclass?.sclassName || "N/A",
        classID: teacher.teachSclass?._id || "",
      }))
    : [];

  const filteredRows = teacherRows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  };

  const ActionMenu = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const actions = [
      {
        icon: <PersonAddIcon className="text-blue-600" />,
        name: "Add New Teacher",
        action: () => navigate("/Admin/teachers/chooseclass"),
      },
      {
        icon: <DeleteIcon className="text-red-600" />,
        name: "Delete Teacher",
        action: () => deleteHandler(row.id, "Teacher"),
      },
    ];

    return (
      <>
        <Tooltip title="More Actions">
          <IconButton
            size="small"
            onClick={handleClick}
            className="text-gray-600 hover:text-gray-800"
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: { mt: 1.5, minWidth: 180, borderRadius: 8, py: 1 },
          }}
        >
          {actions.map(({ icon, name, action }, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                action();
                handleClose();
              }}
              className="hover:bg-blue-50"
            >
              <ListItemIcon className="min-w-[40px]">{icon}</ListItemIcon>
              <span className="text-sm font-medium">{name}</span>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const TeacherRowActions = ({ row }) => (
    <div className="flex items-center justify-center gap-2">
      <Tooltip title="Delete Teacher">
        <IconButton
          onClick={() => deleteHandler(row.id, "Teacher")}
          className="text-red-600 hover:text-red-800"
          size="small"
          aria-label="Delete Teacher"
        >
        </IconButton>
      </Tooltip>

      <button
        onClick={() => navigate(`/Admin/teachers/teacher/${row.id}`)}
        className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={`View teacher ${row.name}`}
      >
        View
      </button>

      <ActionMenu row={row} />
    </div>
  );

  const topActions = [
    {
      icon: (
        <PersonAddIcon className="text-blue-600 group-hover:text-blue-700 transition-colors" />
      ),
      name: "Add New Teacher",
      action: () => navigate("/Admin/teachers/chooseclass"),
      style: "bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-400",
    },
    {
      icon: (
        <DeleteIcon className="text-red-600 group-hover:text-red-700 transition-colors" />
      ),
      name: "Delete All Teachers",
      action: () => deleteHandler(userID, "Teachers"),
      style: "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-400",
    },
  ];

  return (
    <div className="w-full px-4 py-6 min-h-screen bg-gray-50">
      <div className="bg-white mx-auto max-w-7xl p-8 rounded-lg shadow-md">
        {/* Search & top actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-6">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md w-full"
            InputProps={{ className: "text-gray-700" }}
          />

          <div className="flex space-x-4">
            {topActions.map(({ icon, name, action, style }, idx) => (
              <button
                key={idx}
                onClick={action}
                type="button"
                aria-label={name}
                className={`group flex items-center space-x-2 px-5 py-2 rounded-md font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${style}`}
              >
                {icon}
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-700">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">
            Error loading teachers.
          </div>
        ) : filteredRows.length > 0 ? (
          <>
            <div className="relative overflow-x-auto shadow-sm rounded-lg border border-gray-200">
              <table className="w-full text-sm text-center text-gray-700">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {row.name}
                      </td>
                      <td className="px-6 py-4">
                        {row.subject || (
                          <button
                            onClick={() =>
                              navigate(
                                `/Admin/teachers/choosesubject/${row.classID}/${row.id}`
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            Add Subject
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">{row.className}</td>
                      <td className="px-6 py-4">
                        <TeacherRowActions row={row} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <nav
                className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 bg-white border-t border-gray-200"
                aria-label="Table navigation"
              >
                <span className="text-sm text-gray-600 mb-3 sm:mb-0 select-none">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {(currentPage - 1) * rowsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-800">
                    {Math.min(currentPage * rowsPerPage, filteredRows.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredRows.length}
                  </span>{" "}
                  subjects
                </span>

                <ul className="inline-flex items-center space-x-1 text-sm">
                  {/* Conditionally render Previous */}
                  {currentPage > 1 && (
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        className="px-4 py-2 border rounded-l-md bg-white text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                    </li>
                  )}

                  {/* First page & ellipsis */}
                  {getPaginationRange()[0] > 1 && (
                    <>
                      <li>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className={`px-4 py-2 border ${
                            currentPage === 1
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                          aria-current={currentPage === 1 ? "page" : undefined}
                        >
                          1
                        </button>
                      </li>
                      {getPaginationRange()[0] > 2 && (
                        <li>
                          <span className="px-2 py-2 text-gray-500 select-none">
                            ...
                          </span>
                        </li>
                      )}
                    </>
                  )}

                  {/* Page buttons */}
                  {getPaginationRange().map((page) => (
                    <li key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border ${
                          page === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        aria-current={page === currentPage ? "page" : undefined}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  {/* Last page & ellipsis */}
                  {getPaginationRange()[getPaginationRange().length - 1] <
                    totalPages && (
                    <>
                      {getPaginationRange()[getPaginationRange().length - 1] <
                        totalPages - 1 && (
                        <li>
                          <span className="px-2 py-2 text-gray-500 select-none">
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
                          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                          aria-current={
                            currentPage === totalPages ? "page" : undefined
                          }
                        >
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}

                  {/* Conditionally render Next */}
                  {currentPage < totalPages && (
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        className="px-4 py-2 border rounded-r-md bg-white text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-gray-600 font-semibold">
            No teachers found.
          </div>
        )}

        {showPopup && (
          <Popup
            message={message}
            onClose={() => setShowPopup(false)}
            severity="error"
          />
        )}
      </div>
    </div>
  );
};

export default ShowTeachers;