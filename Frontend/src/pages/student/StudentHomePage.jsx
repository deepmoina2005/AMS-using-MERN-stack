import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import CustomBarChart from "../../components/CustomBarChart";
import SeeNotice from "../../components/SeeNotice";
import CountUp from "react-countup";
import { BookOpen, PieChart } from "lucide-react";

// Helpers
const groupAttendanceBySubject = (attendanceArray) => {
  const grouped = {};
  attendanceArray.forEach(({ subName, subId, date, status }) => {
    if (!date || !status) return;
    const subjectName =
      typeof subName === "object" && subName !== null
        ? subName.subName
        : subName;
    if (!grouped[subjectName]) {
      grouped[subjectName] = {
        present: 0,
        absent: 0,
        sessions: 0,
        subId,
        allData: [],
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

const StudentHomePage = () => {
  const dispatch = useDispatch();
  const { currentUser, userDetails, loading } = useSelector(
    (state) => state.user
  );
  const { subjectsList } = useSelector((state) => state.sclass);

  const [subjectAttendance, setSubjectAttendance] = useState([]);

  const classID = currentUser?.sclassName?._id;

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
    if (classID) {
      dispatch(getSubjectList(classID, "ClassSubjects"));
    }
  }, [dispatch, currentUser?._id, classID]);

  useEffect(() => {
    if (userDetails?.attendance) {
      setSubjectAttendance(userDetails.attendance);
    }
  }, [userDetails]);

  const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
  const numberOfSubjects = subjectsList && subjectsList.length;
  const overallAttendancePercentage = parseFloat(
    calculateOverallAttendancePercentage(subjectAttendance)
  );

  const subjectChartData = Object.entries(attendanceBySubject).map(
    ([subName, { present, sessions }]) => ({
      subject: subName,
      attendancePercentage: parseFloat(
        calculateSubjectAttendancePercentage(present, sessions)
      ),
    })
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Total Subjects"
              value={numberOfSubjects}
              icon={<BookOpen className="w-8 h-8 text-indigo-600" />}
              color="text-green-600"
              decimals={0} // 👈 No decimals for subjects
            />
            <Card
              title="Overall Attendance"
              value={overallAttendancePercentage}
              icon={<PieChart className="w-8 h-8 text-blue-600" />}
              color="text-blue-600"
              suffix="%"
              decimals={1} // 👈 Keep 1 decimal for percentage
            />
          </div>

          {subjectChartData.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Subject-wise Attendance
              </h2>
              <CustomBarChart
                chartData={subjectChartData}
                dataKey="attendancePercentage"
              />
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Notices
            </h2>
            <SeeNotice />
          </div>
        </>
      )}
    </div>
  );
};

export default StudentHomePage;

// Card Component
const Card = ({ title, value, icon, color, suffix = "", decimals = 1 }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow duration-300">
    <div className="flex flex-col space-y-1">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>
        <CountUp
          start={0}
          end={parseFloat(value)}
          duration={2.5}
          decimals={decimals}
        />
        {suffix}
      </p>
    </div>
    <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
  </div>
);
