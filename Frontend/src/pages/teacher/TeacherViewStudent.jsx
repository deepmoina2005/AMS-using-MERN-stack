import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { useNavigate, useParams } from "react-router-dom";
import CustomPieChart from "../../components/CustomPieChart";

// Group attendance data by subject
function groupAttendanceBySubject(attendanceArray) {
  const grouped = {};

  attendanceArray.forEach(({ subName, subId, date, status }) => {
    if (!date || !status) return;

    const subjectName =
      typeof subName === "object" && subName !== null ? subName.subName : subName;

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

    const stat = status.trim().toLowerCase();
    if (stat === "present") grouped[subjectName].present += 1;
    else if (stat === "absent") grouped[subjectName].absent += 1;

    grouped[subjectName].sessions =
      grouped[subjectName].present + grouped[subjectName].absent;
  });

  return grouped;
}

// Percentage helpers
function calculateSubjectAttendancePercentage(present, total) {
  return total === 0 ? "0.00" : ((present / total) * 100).toFixed(2);
}

const TeacherViewStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const { currentUser, userDetails, loading } = useSelector((state) => state.user);

  const studentID = params.id;
  const address = "Student";
  const teachSubject = currentUser?.teachSubject?.subName || "";
  const teachSubjectID = currentUser?.teachSubject?._id;

  const [sclassName, setSclassName] = useState("");
  const [studentSchool, setStudentSchool] = useState("");
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [activeTab, setActiveTab] = useState("attendance");

  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  useEffect(() => {
    if (userDetails) {
      setSclassName(userDetails.sclassName || "");
      setStudentSchool(userDetails.school || "");
      setSubjectMarks(userDetails.examResult || []);
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const groupedAttendance = useMemo(
    () => groupAttendanceBySubject(subjectAttendance),
    [subjectAttendance]
  );

  const subjectData = groupedAttendance[teachSubject] || {};
  const subjectPresent = subjectData.present || 0;
  const subjectSessions = subjectData.sessions || 0;

  const subjectAttendancePercentage =
    subjectSessions === 0 ? 0 : (subjectPresent / subjectSessions) * 100;

  const chartData = [
    { name: "Present", value: subjectAttendancePercentage },
    { name: "Absent", value: 100 - subjectAttendancePercentage },
  ];

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      {loading ? (
        <div className="text-center text-gray-500 text-lg font-semibold">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Student Details + Chart */}
          <section className="lg:col-span-1 bg-white rounded-lg shadow-md p-8 border border-gray-200 h-fit">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-300 pb-3">
              Student Details
            </h2>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-gray-800">Name:</span>{" "}
                {userDetails?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Roll Number:</span>{" "}
                {userDetails?.rollNum || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Class:</span>{" "}
                {sclassName?.sclassName || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">School:</span>{" "}
                {studentSchool?.schoolName || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-800">Total Sessions:</span>{" "}
                {subjectSessions}
              </p>
            </div>
            <div className="mt-8 max-w-xs mx-auto">
              <CustomPieChart data={chartData} />
              <p className="text-center mt-4 text-gray-700 font-medium">
                Attendance: {subjectAttendancePercentage.toFixed(2)}%
              </p>
            </div>
          </section>

          {/* Attendance + Marks Tabs */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-300 mb-8">
              <button
                onClick={() => setActiveTab("attendance")}
                className={`py-3 px-6 font-semibold ${
                  activeTab === "attendance"
                    ? "border-b-4 border-indigo-600 text-indigo-700"
                    : "text-gray-600 hover:text-indigo-600"
                } transition`}
              >
                Attendance
              </button>
              <button
                onClick={() => setActiveTab("marks")}
                className={`py-3 px-6 font-semibold ${
                  activeTab === "marks"
                    ? "border-b-4 border-indigo-600 text-indigo-700"
                    : "text-gray-600 hover:text-indigo-600"
                } transition`}
              >
                Marks
              </button>
            </div>

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
              <section>
                <h3 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-2">
                  Attendance Overview
                </h3>

                {subjectAttendance?.length > 0 ? (
                  <>
                    {Object.entries(groupedAttendance).map(
                      ([subName, { present, absent, allData, subId, sessions }]) =>
                        subName.toLowerCase() === teachSubject.toLowerCase() && (
                          <div
                            key={subId}
                            className="mb-8 border rounded-lg shadow-sm overflow-hidden"
                          >
                            <div className="bg-indigo-600 text-white px-6 py-4 font-semibold text-lg">
                              {subName}
                            </div>
                            <div className="p-6 bg-white">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700 text-base mb-6">
                                <p><span className="font-semibold">Present:</span> {present}</p>
                                <p><span className="font-semibold">Total Sessions:</span> {sessions}</p>
                                <p><span className="font-semibold">Percentage:</span> {calculateSubjectAttendancePercentage(present, sessions)}%</p>
                                <p><span className="font-semibold">Absent:</span> {absent}</p>
                              </div>

                              <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200 text-sm text-gray-700">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-6 py-3 text-left border border-gray-200">Date</th>
                                      <th className="px-6 py-3 text-left border border-gray-200">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allData.map((data, idx) => {
                                      const dateStr = new Date(data.date).toISOString().split("T")[0];
                                      return (
                                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                          <td className="px-6 py-3 border border-gray-200">{dateStr}</td>
                                          <td className="px-6 py-3 border border-gray-200">{data.status}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )
                    )}

                    <button
                      onClick={() =>
                        navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)
                      }
                      className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold shadow"
                    >
                      Add Attendance
                    </button>
                  </>
                ) : (
                  <p className="text-gray-600 text-base">No attendance data available.</p>
                )}
              </section>
            )}

            {/* Marks Tab */}
            {activeTab === "marks" && (
              <section>
                <h3 className="text-2xl font-semibold mb-6 text-indigo-700 border-b border-indigo-300 pb-2">
                  Subject Marks
                </h3>

                {subjectMarks?.length > 0 ? (
                  subjectMarks.map((result, idx) =>
                    result.subName?.subName === teachSubject ? (
                      <div
                        key={idx}
                        className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm mb-8"
                      >
                        <table className="min-w-full text-sm text-gray-700">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left border border-gray-300">Subject</th>
                              <th className="px-6 py-3 text-left border border-gray-300">Marks</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="bg-white">
                              <td className="px-6 py-3 border border-gray-300">
                                {result.subName.subName}
                              </td>
                              <td className="px-6 py-3 border border-gray-300">
                                {result.marksObtained}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null
                  )
                ) : (
                  <p className="text-gray-600 text-base mb-6">No marks available.</p>
                )}

                <button
                  onClick={() =>
                    navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)
                  }
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition font-semibold shadow"
                >
                  Add Marks
                </button>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherViewStudent;
