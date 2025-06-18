/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import CustomBarChart from '../../../components/CustomBarChart';
import Popup from '../../../components/Popup';

const ViewStudent = () => {
  const [showTab, setShowTab] = useState('details');
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: studentID } = useParams();
  const address = "Student";

  const { userDetails, loading } = useSelector((state) => state.user);

  const [name, setName] = useState('');
  const [rollNum, setRollNum] = useState('');
  const [password, setPassword] = useState('');
  const [sclassName, setSclassName] = useState(null);
  const [studentSchool, setStudentSchool] = useState(null);
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [openStates, setOpenStates] = useState({});
  const [selectedView, setSelectedView] = useState('table');

  // Fetch user details on load or studentID change
  useEffect(() => {
    dispatch(getUserDetails(studentID, address));
  }, [dispatch, studentID]);

  // Fetch subject list when class info is available
  useEffect(() => {
    if (userDetails && userDetails.sclassName && userDetails.sclassName._id) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
    }
  }, [dispatch, userDetails]);

  // Sync local state with userDetails from redux store
  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || '');
      setRollNum(userDetails.rollNum || '');
      setSclassName(userDetails.sclassName || null);
      setStudentSchool(userDetails.school || null);
      setSubjectMarks(userDetails.examResult || []);
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  // Prepare data for update
  const fields = password === "" ? { name, rollNum } : { name, rollNum, password };

  // Handle user info update
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser(fields, studentID, address)).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  // Disabled delete alert
  const deleteHandler = () => {
    setMessage("Sorry, the delete function has been disabled for now.");
    setShowPopup(true);
  };

  // Remove all or partial attendance/marks
  const removeHandler = (id, deladdress) => {
    dispatch(removeStuff(id, deladdress)).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  // Remove attendance for a specific subject
  const removeSubAttendance = (subId) => {
    dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten")).then(() => {
      dispatch(getUserDetails(studentID, address));
    });
  };

  // Toggle attendance details visibility for a subject
  const handleOpen = (subId) => {
    setOpenStates((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  // Group attendance records by subject
  const groupAttendanceBySubject = (attendanceArray) => {
    const grouped = {};

    attendanceArray.forEach(({ subName, subId, date, status }) => {
      if (!date || !status) return;

      const subjectName = (typeof subName === "object" && subName !== null) ? subName.subName : subName;

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

      grouped[subjectName].sessions = grouped[subjectName].present + grouped[subjectName].absent;
    });

    return grouped;
  };

  // Calculate attendance percentage for a subject
  const calculateSubjectAttendancePercentage = (present, sessions) => {
    if (sessions === 0) return 0;
    return ((present / sessions) * 100).toFixed(2);
  };

  // Calculate overall attendance percentage
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

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

  // Prepare attendance data for charts
  const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
    ([subName, { present, sessions }]) => ({
      subject: subName,
      attendancePercentage: Number(calculateSubjectAttendancePercentage(present, sessions)),
      totalClasses: sessions,
      attendedClasses: present,
    })
  );

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="flex space-x-4 border-b mb-4">
            <button
              onClick={() => setShowTab('details')}
              className={`px-4 py-2 ${showTab === 'details' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              Details
            </button>
            <button
              onClick={() => setShowTab('attendance')}
              className={`px-4 py-2 ${showTab === 'attendance' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              Attendance
            </button>
            <button
              onClick={() => setShowTab('marks')}
              className={`px-4 py-2 ${showTab === 'marks' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              Marks
            </button>
          </div>

          {showTab === 'details' && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Roll Number:</strong> {rollNum}</p>
              <p><strong>Class:</strong> {sclassName?.sclassName || '-'}</p>
              <p><strong>School:</strong> {studentSchool?.schoolName || '-'}</p>
              <button
                className="mt-4 bg-red-700 text-white px-4 py-2 rounded"
                onClick={deleteHandler}
              >
                Delete
              </button>
            </div>
          )}

          {showTab === 'attendance' && (
            <div>
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={() => setSelectedView('table')}
                  className={`px-4 py-2 ${selectedView === 'table' ? 'bg-blue-700 text-white' : 'bg-gray-300'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setSelectedView('chart')}
                  className={`px-4 py-2 ${selectedView === 'chart' ? 'bg-blue-700 text-white' : 'bg-gray-300'}`}
                >
                  Chart
                </button>
              </div>

              {subjectAttendance.length > 0 ? (
                selectedView === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border">
                      <thead>
                        <tr className="bg-gray-200 text-center">
                          <th className="px-4 py-2">Subject</th>
                          <th>Present</th>
                          <th>Absent</th> {/* Added Absent column */}
                          <th>Total Sessions</th>
                          <th>percantage %</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
                          ([subName, { present, absent, sessions, allData, subId }], index) => (
                            <React.Fragment key={index}>
                              <tr className="text-center border-t">
                                <td className="px-4 py-2">{subName}</td>
                                <td>{present}</td>
                                <td>{absent}</td> {/* Display Absent count */}
                                <td>{sessions}</td>
                                <td>{calculateSubjectAttendancePercentage(present, sessions)}%</td>
                                <td className="space-x-2">
                                  <button
                                    onClick={() => handleOpen(subId)}
                                    className="bg-yellow-600 text-white px-2 py-1 rounded"
                                  >
                                    {openStates[subId] ? 'Hide' : 'Details'}
                                  </button>
                                  <button
                                    onClick={() => removeSubAttendance(subId)}
                                    className="bg-red-600 text-white px-2 py-1 rounded"
                                  >
                                    Remove
                                  </button>
                                  <button
                                    onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}
                                    className="bg-purple-800 text-white px-2 py-1 rounded"
                                  >
                                    Change
                                  </button>
                                </td>
                              </tr>
                              {openStates[subId] && (
                                <tr>
                                  <td colSpan="6" className="bg-gray-100">
                                    <div className="p-4">
                                      <h4 className="font-semibold mb-2">Attendance Details</h4>
                                      <ul className="list-disc ml-5 space-y-1">
                                        {allData.map((d, i) => (
                                          <li key={i}>
                                            {new Date(d.date).toISOString().substring(0, 10)} - {d.status}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          )
                        )}
                      </tbody>
                    </table>
                    <div className="mt-4">
                      <p>Overall Attendance: {overallAttendancePercentage}%</p>
                    </div>
                    <button
                      className="mt-4 bg-red-700 text-white px-4 py-2 rounded mr-2"
                      onClick={() => removeHandler(studentID, "RemoveStudentAtten")}
                    >
                      Delete All
                    </button>
                    <button
                      className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
                      onClick={() => navigate(`/Admin/students/student/attendance/${studentID}`)}
                    >
                      Add Attendance
                    </button>
                  </div>
                ) : (
                  <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                )
              ) : (
                <button
                  className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/Admin/students/student/attendance/${studentID}`)}
                >
                  Add Attendance
                </button>
              )}
            </div>
          )}

          {showTab === 'marks' && (
            <div>
              {subjectMarks.length > 0 ? (
                selectedView === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2">Subject</th>
                          <th>Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectMarks.map((res, idx) => (
                          res.subName ? (
                            <tr key={idx} className="text-center border-t">
                              <td>{res.subName.subName}</td>
                              <td>{res.marksObtained}</td>
                            </tr>
                          ) : null
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
                      onClick={() => navigate(`/Admin/students/student/marks/${studentID}`)}
                    >
                      Add Marks
                    </button>
                  </div>
                ) : (
                  <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                )
              ) : (
                <button
                  className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/Admin/students/student/marks/${studentID}`)}
                >
                  Add Marks
                </button>
              )}
            </div>
          )}
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default ViewStudent;
