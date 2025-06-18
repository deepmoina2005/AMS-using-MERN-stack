import React, { useEffect, useState } from "react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import CustomBarChart from "../../components/CustomBarChart";

// Helper functions
const groupAttendanceBySubject = (attendanceArray) => {
  const grouped = {};

  attendanceArray.forEach(({ subName, subId, date, status }) => {
    if (!date || !status) return;

    // Normalize subject name if needed
    const subjectName =
      typeof subName === "object" && subName !== null
        ? subName.subName
        : subName;

    if (!grouped[subjectName]) {
      grouped[subjectName] = {
        present: 0,
        absent: 0,
        allData: [],
        subId,
        sessions: 0,
      };
    }

    grouped[subjectName].allData.push({ date, status });

    const s = status.trim().toLowerCase();

    if (s === "present") grouped[subjectName].present++;
    else if (s === "absent") grouped[subjectName].absent++;

    grouped[subjectName].sessions =
      grouped[subjectName].present + grouped[subjectName].absent;
  });

  return grouped;
};

const calculateSubjectAttendancePercentage = (present, sessions) => {
  if (sessions === 0) return 0;
  return ((present / sessions) * 100).toFixed(2);
};

const calculateOverallAttendancePercentage = (attendanceArray) => {
  if (!attendanceArray || attendanceArray.length === 0) return 0;

  let totalPresent = 0;
  let totalSessions = 0;

  attendanceArray.forEach(({ status }) => {
    const s = status.trim().toLowerCase();
    if (s === "present") totalPresent++;
    if (s === "present" || s === "absent") totalSessions++;
  });

  if (totalSessions === 0) return 0;

  return ((totalPresent / totalSessions) * 100).toFixed(2);
};

// Main component
const ViewStdAttendance = () => {
  const dispatch = useDispatch();

  const [openStates, setOpenStates] = useState({});
  const [selectedSection, setSelectedSection] = useState("table");

  const { userDetails, currentUser, loading, response, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (response) console.log(response);
    if (error) console.error(error);
  }, [response, error]);

  const handleToggle = (subId) => {
    setOpenStates((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d) ? "Invalid Date" : d.toISOString().slice(0, 10);
  };

  const subjectAttendance = userDetails?.attendance || [];
  const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);

  // Calculate overall attendance % as a number (not string)
  const overallAttendancePercentage = parseFloat(
    calculateOverallAttendancePercentage(subjectAttendance)
  );

  // Prepare data for chart
  const subjectData = Object.entries(attendanceBySubject).map(
    ([subName, { present, sessions }]) => ({
      subject: subName,
      attendancePercentage: parseFloat(
        calculateSubjectAttendancePercentage(present, sessions)
      ),
      totalClasses: sessions,
      attendedClasses: present,
    })
  );

  const handleSectionChange = (section) => setSelectedSection(section);

  const renderTableSection = () => (
    <>
      <h2 className="text-3xl font-semibold text-center mb-6">Attendance</h2>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white text-left">
              <th className="p-3 border border-gray-300">Subject</th>
              <th className="p-3 border border-gray-300">Present</th>
              <th className="p-3 border border-gray-300">Total Sessions</th>
              <th className="p-3 border border-gray-300">Attendance %</th>
              <th className="p-3 border border-gray-300 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(attendanceBySubject).map(
              ([subName, { present, allData, subId, sessions }]) => {
                const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
                  present,
                  sessions
                );
                const isOpen = !!openStates[subId];

                return (
                  <React.Fragment key={subId || subName}>
                    <tr
                      className="hover:bg-gray-100 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <td className="p-3 border border-gray-300">{subName}</td>
                      <td className="p-3 border border-gray-300">{present}</td>
                      <td className="p-3 border border-gray-300">{sessions}</td>
                      <td className="p-3 border border-gray-300">
                        {subjectAttendancePercentage}%
                      </td>
                      <td className="p-3 border border-gray-300 text-center">
                        <button
                          onClick={() => handleToggle(subId)}
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold"
                          aria-label={`${isOpen ? "Collapse" : "Expand"} attendance details for ${subName}`}
                        >
                          {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={5} className="p-0 border border-gray-300 bg-gray-50">
                          <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">Attendance Details</h3>
                            <div className="overflow-x-auto">
                              <table className="min-w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                  <tr className="bg-gray-200 text-left">
                                    <th className="p-2 border border-gray-300">Date</th>
                                    <th className="p-2 border border-gray-300 text-right">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allData.map((data, idx) => (
                                    <tr key={idx} className="hover:bg-gray-100">
                                      <td className="p-2 border border-gray-300">
                                        {formatDate(data.date)}
                                      </td>
                                      <td className="p-2 border border-gray-300 text-right">
                                        {data.status}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right text-lg font-semibold">
        Overall Attendance Percentage:{" "}
        <span className="text-blue-700">
          {overallAttendancePercentage.toFixed(2)}%
        </span>
      </div>
    </>
  );

  const renderChartSection = () => (
    <div className="max-w-4xl mx-auto">
      <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
    </div>
  );

  return (
    <div className="relative min-h-screen pb-24 bg-gray-50 px-4 py-8">
      {loading ? (
        <div className="text-center text-gray-600 text-xl">Loading...</div>
      ) : subjectAttendance.length > 0 ? (
        <>
          <div className="mb-6">
            {selectedSection === "table" && renderTableSection()}
            {selectedSection === "chart" && renderChartSection()}
          </div>

          {/* Bottom Navigation */}
          <nav
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-inner flex justify-around py-3"
            role="navigation"
            aria-label="View selection navigation"
          >
            <button
              onClick={() => handleSectionChange("table")}
              className={`flex flex-col items-center text-sm font-medium transition-colors ${
                selectedSection === "table"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              aria-pressed={selectedSection === "table"}
              aria-label="Table View"
              type="button"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill={selectedSection === "table" ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              Table
            </button>

            <button
              onClick={() => handleSectionChange("chart")}
              className={`flex flex-col items-center text-sm font-medium transition-colors ${
                selectedSection === "chart"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              aria-pressed={selectedSection === "chart"}
              aria-label="Chart View"
              type="button"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill={selectedSection === "chart" ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 11h4v7H4zM10 7h4v11h-4zM16 4h4v14h-4z" />
              </svg>
              Chart
            </button>
          </nav>
        </>
      ) : (
        <div className="text-center text-gray-700 text-lg font-medium">
          Currently You Have No Attendance Details
        </div>
      )}
    </div>
  );
};

export default ViewStdAttendance;