import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";

const ChooseClass = ({ situation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllSclasses(currentUser._id, "Sclass"));
    }
  }, [currentUser?._id, dispatch]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const navigateHandler = (classID) => {
    if (situation === "Teacher") {
      navigate("/Admin/teachers/choosesubject/" + classID);
    } else if (situation === "Subject") {
      navigate("/Admin/addsubject/" + classID);
    }
  };

  if (error) {
    console.error(error);
  }

  // Filter classes by search term (case-insensitive)
  const filteredClasses = Array.isArray(sclassesList)
    ? sclassesList.filter((cls) =>
        cls.sclassName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Pagination calculations
  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        {loading ? (
          <div className="text-center text-gray-700 text-lg font-semibold">
            Loading...
          </div>
        ) : getresponse ? (
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/Admin/addclass")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded shadow transition"
            >
              Add Class
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Choose a class</h2>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {filteredClasses.length > 0 ? (
              <>
                <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Class Name
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Choose</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedClasses.map((sclass) => (
                        <tr
                          key={sclass._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                            {sclass.sclassName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => navigateHandler(sclass._id)}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1 px-4 rounded shadow transition"
                            >
                              Choose
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <nav
                  className="flex justify-between items-center mt-6"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md border ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white transition"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-md border ${
                            page === currentPage
                              ? "bg-purple-600 text-white border-purple-600"
                              : "text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white transition"
                          }`}
                          aria-current={page === currentPage ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-4 py-2 rounded-md border ${
                      currentPage === totalPages || totalPages === 0
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white transition"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </>
            ) : (
              <p className="text-center text-gray-500 mt-10">
                No classes found.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChooseClass;
