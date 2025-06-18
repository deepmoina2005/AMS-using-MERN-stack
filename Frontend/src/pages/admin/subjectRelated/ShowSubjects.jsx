import React, { useEffect, useState } from "react";
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
  PostAdd as PostAddIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle";
import Popup from "../../../components/Popup";

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subjectsList, loading, response } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);
  const userID = currentUser?._id;

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (userID) {
      dispatch(getSubjectList(userID, "AllSubjects"));
    }
  }, [userID, dispatch]);

  const deleteHandler = async (deleteID, address) => {
    try {
      await dispatch(deleteUser(deleteID, address));
      dispatch(getSubjectList(userID, "AllSubjects"));
    } catch (err) {
      setMessage("Error deleting subject");
      setShowPopup(true);
    }
  };

  const subjectRows = Array.isArray(subjectsList)
    ? subjectsList.map((subject) => ({
        id: subject._id,
        subName: subject.subName,
        sessions: subject.sessions,
        sclassName: subject.sclassName?.sclassName || "N/A",
        sclassID: subject.sclassName?._id || "",
      }))
    : [];

  const filteredRows = subjectRows.filter((row) =>
    row.subName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
      <>
        <Tooltip title="More Actions">
          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: { mt: 1.5, minWidth: 180, borderRadius: 2, py: 1 },
          }}
        >
          {actions.map(({ icon, name, action }, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                action();
                handleClose();
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              {name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const SubjectButtonHaver = ({ row }) => {
    const actions = [
      {
        icon: <PostAddIcon className="text-blue-500" />,
        name: "View Subject",
        action: () =>
          navigate(`/Admin/subjects/subject/${row.sclassID}/${row.id}`),
      },
    ];

    return (
      <div className="flex items-center justify-center gap-2">
        <Tooltip title="Delete Subject">
          <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
            <DeleteIcon className="text-red-600 hover:text-red-800" />
          </IconButton>
        </Tooltip>
        <ActionMenu actions={actions} />
      </div>
    );
  };

  const speedDialActions = [
    {
      icon: <PostAddIcon className="text-blue-500" />,
      name: "Add New Subject",
      action: () => navigate("/Admin/subjects/chooseclass"),
    },
    {
      icon: <DeleteIcon className="text-red-500" />,
      name: "Delete All Subjects",
      action: () => deleteHandler(userID, "Subjects"),
    },
  ];

  return (
    <div className="w-full px-4 py-6 min-h-screen bg-gray-50">
      <div className="bg-white mx-auto max-w-7xl p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md w-full"
            InputProps={{ className: "text-gray-700" }}
          />
          <div className="flex space-x-4">
            {speedDialActions.map(({ icon, name, action }, idx) => (
              <button
                key={idx}
                onClick={action}
                className={`flex items-center space-x-2 px-5 py-2 rounded-md font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  name.toLowerCase().includes("delete")
                    ? "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-400"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-400"
                }`}
              >
                {icon}
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-700">
            Loading...
          </div>
        ) : filteredRows.length > 0 ? (
          <>
            <div className="relative overflow-x-auto shadow-sm rounded-lg border border-gray-200">
              <table className="w-full text-sm text-center text-gray-700">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Subject Name</th>
                    <th className="px-6 py-3 font-semibold">Class</th>
                    <th className="px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRows.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {row.subName}
                      </td>
                      <td className="px-6 py-4">{row.sclassName}</td>
                      <td className="px-6 py-4">
                        <SubjectButtonHaver row={row} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
                  {currentPage > 1 && (
                    <li>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="px-4 py-2 border rounded-l-md bg-white text-gray-600 hover:bg-gray-100"
                      >
                        Previous
                      </button>
                    </li>
                  )}

                  {getPaginationRange()[0] > 1 && (
                    <>
                      <li>
                        <button
                          onClick={() => setCurrentPage(1)}
                          className="px-4 py-2 border bg-white text-gray-600 hover:bg-gray-100"
                        >
                          1
                        </button>
                      </li>
                      <li>
                        <span className="px-2 py-2 text-gray-500 select-none">
                          ...
                        </span>
                      </li>
                    </>
                  )}

                  {getPaginationRange().map((page) => (
                    <li key={page}>
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border ${
                          page === currentPage
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  {getPaginationRange()[getPaginationRange().length - 1] < totalPages && (
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
                          }`}
                        >
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}

                  {currentPage < totalPages && (
                    <li>
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        className="px-4 py-2 border rounded-r-md bg-white text-gray-600 hover:bg-gray-100"
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
          <div className="text-center text-gray-500 text-lg mt-20">
            No subjects found.
          </div>
        )}

        <Popup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          message={message}
          title="Notification"
        />
      </div>
    </div>
  );
};

export default ShowSubjects;
