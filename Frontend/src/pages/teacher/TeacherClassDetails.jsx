import React, { useEffect, useState, useMemo } from "react";
import {
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getClassStudents,
  getSubjectList,
} from "../../redux/sclassRelated/sclassHandle";
import { updateStudentFields } from "../../redux/studentRelated/studentHandle";
import { BlueButton } from "../../components/buttonStyles";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassStudents = [], loading, error } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector((state) => state.user);

  const classID = currentUser?.teachSclass?._id;
  const subjectID = currentUser?.teachSubject?._id;

  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceDate, setAttendanceDate] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (classID) {
      dispatch(getClassStudents(classID));
      dispatch(getSubjectList(classID, "ClassSubjects"));
    }
  }, [dispatch, classID]);

  const handleAttendance = (studentId, status, name) => {
    if (!attendanceDate) {
      return setSnackbar({
        open: true,
        message: "Please select a date for attendance.",
        severity: "warning",
      });
    }

    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    setSnackbar({
      open: true,
      message: `${name} marked as ${status}`,
      severity: "success",
    });
  };

  const handleSubmitAttendance = () => {
    if (!attendanceDate) {
      return setSnackbar({
        open: true,
        message: "Select a date before submitting attendance.",
        severity: "warning",
      });
    }

    Object.entries(attendanceData).forEach(([studentId, status]) => {
      const fields = {
        subName: subjectID,
        status,
        date: attendanceDate,
      };
      dispatch(updateStudentFields(studentId, fields, "StudentAttendance"));
    });

    setSnackbar({
      open: true,
      message: "Attendance submitted successfully.",
      severity: "success",
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const filteredStudents = sclassStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSessions = useMemo(() => {
    const datesSet = new Set();
    sclassStudents.forEach((student) => {
      (student.attendance || []).forEach((att) => {
        if (
          att.subName === subjectID ||
          (typeof att.subName === "object" && att.subName?._id === subjectID)
        ) {
          if (att.date) {
            datesSet.add(att.date);
          }
        }
      });
    });
    return datesSet.size;
  }, [sclassStudents, subjectID]);

  const getAttendanceCount = (student, statusToCount) => {
    if (!student.attendance) return 0;
    return student.attendance.filter(
      (att) =>
        (att.subName === subjectID ||
          (typeof att.subName === "object" && att.subName?._id === subjectID)) &&
        att.status === statusToCount
    ).length;
  };

  const handleExportExcel = () => {
    const table = document.getElementById("attendance-summary-table");
    const tableHTML = table.outerHTML.replace(/ /g, "%20");

    const filename = "Attendance_Summary.xls";
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = "data:application/vnd.ms-excel," + tableHTML;
    downloadLink.download = filename;
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePrintOnlyTable = () => {
    const printContents = document.getElementById("attendance-print-section").innerHTML;
    const printWindow = window.open("", "", "height=600,width=1000");

    printWindow.document.write("<html><head><title>Attendance Summary</title>");
    printWindow.document.write(
      "<style>table, th, td { border: 1px solid #ccc; border-collapse: collapse; padding: 8px; } th { background: #f0f0f0; }</style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContents);
    printWindow.document.write("</body></html>");

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const StudentsButtonHaver = ({ row }) => (
    <BlueButton
      size="small"
      variant="contained"
      onClick={() => navigate(`/Teacher/class/student/${row._id}`)}
    >
      View
    </BlueButton>
  );

  return (
    <div className="w-full px-4 py-6 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
          Class Details
        </h1>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-row gap-6">
            <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
           <div className="flex flex-row gap-2">
            <button
              onClick={handlePrintOnlyTable}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
            >
              Print
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 transition"
            >
              Export
            </button>
           </div>
          </div>
          <div className="flex gap-2">
            <div className="font-semibold text-gray-700 text-lg ml-4">
              Total Sessions: {totalSessions}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          </div>
        ) : filteredStudents.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-lg font-medium">
            No students found in this class.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 w-full">

                {/* Attendance Summary Table */}
                <div id="attendance-print-section" className="overflow-x-auto">
                  
                  <table
                    id="attendance-summary-table"
                    className="min-w-[600px] table-auto border m-4 border-gray-300 rounded-md shadow-sm"
                  >
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600 font-semibold">
                      <tr>
                        <th className="px-6 py-3 text-left">Name</th>
                        <th className="px-6 py-3 text-left">Roll Number</th>
                        <th className="px-6 py-3 text-center text-green-700">Present</th>
                        <th className="px-6 py-3 text-center text-red-700">Absent</th>
                        <th className="px-6 py-3 text-center text-blue-700">Percentage %</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300 text-sm">
                      {filteredStudents.map((student) => {
                        const totalPresent = getAttendanceCount(student, "Present");
                        const totalAbsent = getAttendanceCount(student, "Absent");
                        const percentage = totalSessions > 0 ? ((totalPresent / totalSessions) * 100).toFixed(1) : "0.0";

                        return (
                          <tr key={student._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                            <td className="px-6 py-4 text-gray-800">{student.rollNum}</td>
                            <td className="px-6 py-4 text-center font-semibold text-green-700">{totalPresent}</td>
                            <td className="px-6 py-4 text-center font-semibold text-red-700">{totalAbsent}</td>
                            <td className="px-6 py-4 text-center font-semibold text-blue-700">{percentage}%</td>
                            <td className="px-6 py-4 text-center">
                              <StudentsButtonHaver row={student} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Attendance Input Table */}
                <div className="overflow-x-auto w-f">
                  <table className="min-w-[280px] table-auto border border-gray-300 rounded-md m-4 shadow-sm">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-600 font-semibold">
                      <tr>
                        <th className="px-6 py-3">
                          <div className="flex flex-row gap-2">
                            <label htmlFor="attendance-date" className="text-sm text-gray-700 font-medium">
                              Attendance Date
                            </label>
                            <input
                              id="attendance-date"
                              type="date"
                              value={attendanceDate}
                              onChange={(e) => setAttendanceDate(e.target.value)}
                              className="border border-gray-300 rounded-md p-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300 text-sm">
                      {filteredStudents.map((student) => {
                        const status = attendanceData[student._id];
                        return (
                          <tr key={student._id} className="hover:bg-gray-50 transition">
                            <td className="px-14 py-4">
                              <div className="flex gap-3">
                                <button
                                  className={`w-24 px-4 py-1.5 rounded-md text-sm font-semibold transition ${
                                    status === "Present"
                                      ? "bg-green-600 text-white hover:bg-green-700"
                                      : "border border-green-600 text-green-600 hover:bg-green-100"
                                  }`}
                                  onClick={() => handleAttendance(student._id, "Present", student.name)}
                                >
                                  Present
                                </button>
                                <button
                                  className={`w-24 px-4 py-1.5 rounded-md text-sm font-semibold transition ${
                                    status === "Absent"
                                      ? "bg-red-600 text-white hover:bg-red-700"
                                      : "border border-red-600 text-red-600 hover:bg-red-100"
                                  }`}
                                  onClick={() => handleAttendance(student._id, "Absent", student.name)}
                                >
                                  Absent
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Attendance Button */}
              <div className="mt-6 flex justify-end m-4">
                <button
                  onClick={handleSubmitAttendance}
                  disabled={!attendanceDate}
                  className={`px-6 py-2 text-white rounded-md font-semibold transition ${
                    attendanceDate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Attendance
                </button>
              </div>
            </div>
          </>
        )}

        {error && (
          <p className="text-center text-red-600 mt-4 font-semibold">{error}</p>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default TeacherClassDetails;