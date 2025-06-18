import React, { useEffect, useState } from "react";
import { getClassStudents, getSubjectDetails } from "../../../redux/sclassRelated/sclassHandle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  BlueButton,
  GreenButton,
  PurpleButton,
} from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse } = useSelector(
    (state) => state.sclass
  );

  const { classID, subjectID } = params;

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
    dispatch(getClassStudents(classID));
  }, [dispatch, subjectID, classID]);

  const [tab, setTab] = useState("details");
  const [selectedSection, setSelectedSection] = useState("attendance");

  const handleSectionChange = (section) => setSelectedSection(section);

  const studentColumns = [
    { id: "rollNum", label: "Roll No.", minWidth: 100 },
    { id: "name", label: "Name", minWidth: 170 },
  ];

  const studentRows = sclassStudents.map((student) => ({
    rollNum: student.rollNum,
    name: student.name,
    id: student._id,
  }));

  const StudentsAttendanceButtonHaver = ({ row }) => (
    <div className="flex gap-2">
      <BlueButton onClick={() => navigate("/Admin/students/student/" + row.id)}>
        View
      </BlueButton>
      <PurpleButton
        onClick={() =>
          navigate(`/Admin/subject/student/attendance/${row.id}/${subjectID}`)
        }
      >
        Take Attendance
      </PurpleButton>
    </div>
  );

  const StudentsMarksButtonHaver = ({ row }) => (
    <div className="flex gap-2">
      <BlueButton onClick={() => navigate("/Admin/students/student/" + row.id)}>
        View
      </BlueButton>
      <PurpleButton
        onClick={() =>
          navigate(`/Admin/subject/student/marks/${row.id}/${subjectID}`)
        }
      >
        Provide Marks
      </PurpleButton>
    </div>
  );

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length;
    return (
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-center">Subject Details</h2>
        <p className="text-lg">Subject Name: {subjectDetails?.subName}</p>
        <p className="text-lg">Subject Code: {subjectDetails?.subCode}</p>
        <p className="text-lg">Number of Students: {numberOfStudents}</p>
        <p className="text-lg">
          Class Name: {subjectDetails?.sclassName?.sclassName}
        </p>
        {subjectDetails?.teacher ? (
          <p className="text-lg">Teacher Name: {subjectDetails.teacher.name}</p>
        ) : (
          <GreenButton
            onClick={() =>
              navigate("/Admin/teachers/addteacher/" + subjectDetails._id)
            }
          >
            Add Subject Teacher
          </GreenButton>
        )}
      </div>
    );
  };

  const SubjectStudentsSection = () => (
    <div className="relative pb-20">
      {getresponse ? (
        <div className="flex justify-end mt-4">
          <GreenButton onClick={() => navigate("/Admin/class/addstudents/" + classID)}>
            Add Students
          </GreenButton>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4">Students List:</h3>
          {selectedSection === "attendance" && (
            <TableTemplate
              buttonHaver={StudentsAttendanceButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
          )}
          {selectedSection === "marks" && (
            <TableTemplate
              buttonHaver={StudentsMarksButtonHaver}
              columns={studentColumns}
              rows={studentRows}
            />
          )}
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md z-10">
            <div className="flex justify-around py-2">
              <button
                onClick={() => handleSectionChange("attendance")}
                className={`flex flex-col items-center ${
                  selectedSection === "attendance" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {selectedSection === "attendance" ? (
                  <TableChartIcon />
                ) : (
                  <TableChartOutlinedIcon />
                )}
                <span className="text-sm">Attendance</span>
              </button>
              <button
                onClick={() => handleSectionChange("marks")}
                className={`flex flex-col items-center ${
                  selectedSection === "marks" ? "text-green-600" : "text-gray-500"
                }`}
              >
                {selectedSection === "marks" ? (
                  <InsertChartIcon />
                ) : (
                  <InsertChartOutlinedIcon />
                )}
                <span className="text-sm">Marks</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (subloading) return <div className="text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-8">
      <div className="border-b border-gray-300 mb-6">
        <nav className="flex gap-4">
          <button
            className={`py-2 px-4 border-b-2 ${
              tab === "details" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"
            }`}
            onClick={() => setTab("details")}
          >
            Details
          </button>
          <button
            className={`py-2 px-4 border-b-2 ${
              tab === "students" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"
            }`}
            onClick={() => setTab("students")}
          >
            Students
          </button>
        </nav>
      </div>

      <div>
        {tab === "details" && <SubjectDetailsSection />}
        {tab === "students" && <SubjectStudentsSection />}
      </div>
    </div>
  );
};

export default ViewSubject;
