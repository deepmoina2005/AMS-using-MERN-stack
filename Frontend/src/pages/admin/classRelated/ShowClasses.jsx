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
  PostAdd as PostAddIcon,
  PersonAddAlt1 as PersonAddAlt1Icon,
  AddCard as AddCardIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

import { deleteUser } from "../../../redux/userRelated/userHandle";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
// Removed import of GreenButton since it's not needed anymore
import { BlueButton } from "../../../components/buttonStyles";
import Popup from "../../../components/Popup";

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux selectors
  const { sclassesList, loading } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);
  const adminID = currentUser?._id;

  // Local states
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllSclasses(adminID, "Sclass"));
    }
  }, [adminID, dispatch]);

  const deleteHandler = async (deleteID, address) => {
    try {
      await dispatch(deleteUser(deleteID, address));
      dispatch(getAllSclasses(adminID, "Sclass"));
    } catch (err) {
      setMessage("Error deleting class", err);
      setShowPopup(true);
    }
  };

  // Map sclassesList to simpler row data
  const sclassRows = Array.isArray(sclassesList)
    ? sclassesList.map(({ sclassName, _id }) => ({ name: sclassName, id: _id }))
    : [];

  // Filter by search term (case insensitive)
  const filteredRows = sclassRows.filter((row) =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Generate pagination range with max 5 pages shown
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

  // Actions menu component
  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
      <>
        <Tooltip title="More Actions">
          <IconButton
            onClick={handleClick}
            size="small"
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
            sx: {
              mt: 1.5,
              minWidth: 180,
              borderRadius: 2,
              py: 1,
              bgcolor: "background.paper",
            },
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

  // Buttons for each row
  const SclassButtonHaver = ({ row }) => {
    const actions = [
      {
        icon: <PostAddIcon className="text-blue-500" />,
        name: "Add Subjects",
        action: () => navigate(`/Admin/addsubject/${row.id}`),
      },
      {
        icon: <PersonAddAlt1Icon className="text-green-500" />,
        name: "Add Student",
        action: () => navigate(`/Admin/class/addstudents/${row.id}`),
      },
    ];

    return (
      <div className="flex items-center justify-center gap-2">
        <Tooltip title="Delete Class">
          <IconButton onClick={() => deleteHandler(row.id, "Sclass")}>
            <DeleteIcon className="text-red-600 hover:text-red-800" />
          </IconButton>
        </Tooltip>
        <Tooltip title="View Class Details">
          <BlueButton
            variant="contained"
            className="!px-3 !py-1 !text-sm"
            onClick={() => navigate(`/Admin/classes/class/${row.id}`)}
          >
            View
          </BlueButton>
        </Tooltip>
        <ActionMenu actions={actions} />
      </div>
    );
  };

  // Top speed dial / actions
  const speedDialActions = [
    {
      icon: <AddCardIcon className="text-blue-500" />,
      name: "Add New Class",
      action: () => navigate("/Admin/addclass"),
    },
    {
      icon: <DeleteIcon className="text-red-500" />,
      name: "Delete All Classes",
      action: () => deleteHandler(adminID, "Sclasses"),
    },
  ];

  return (
    <div className="w-full px-4 py-6 min-h-screen bg-gray-50">
      <div className="bg-white mx-auto max-w-7xl p-8 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-6">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md w-full"
            InputProps={{
              className: "text-gray-700",
            }}
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
                aria-label={name}
                type="button"
              >
                {icon}
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-700">
            Loading...
          </div>
        ) : filteredRows.length > 0 ? (
          <div className="relative overflow-x-auto shadow-sm rounded-lg border border-gray-200">
            <table className="w-full text-sm text-center text-gray-700">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wide">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Class Name
                  </th>
                  <th scope="col" className="px-6 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRows.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-6 py-4">
                      <SclassButtonHaver row={row} />
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
              <span className="text-sm text-gray-600 mb-3 sm:mb-0">
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
                classes
              </span>

              <ul className="inline-flex items-center space-x-1 text-sm">
                <li>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="px-4 py-2 border rounded-l-md bg-white text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>

                {/* Show first page & ellipsis */}
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

                {/* Pagination buttons */}
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

                {/* Show last page & ellipsis */}
                {getPaginationRange()[getPaginationRange().length - 1] < totalPages && (
                  <>
                    {getPaginationRange()[getPaginationRange().length - 1] < totalPages - 1 && (
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
                        aria-current={currentPage === totalPages ? "page" : undefined}
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
                    className="px-4 py-2 border rounded-r-md bg-white text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    aria-label="Next page"
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        ) : (
          <p className="text-center text-gray-700 font-semibold text-lg py-20">
            No classes found.
          </p>
        )}

        <Popup
          open={showPopup}
          handleClose={() => setShowPopup(false)}
          message={message}
        />
      </div>
    </div>
  );
};

export default ShowClasses;
