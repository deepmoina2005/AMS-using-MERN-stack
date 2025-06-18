import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getClassDetails,
  getClassStudents,
  getSubjectList
} from "../../../redux/sclassRelated/sclassHandle";

import { BlueButton, GreenButton, PurpleButton } from "../../../components/buttonStyles";
import TableTemplate from "../../../components/TableTemplate";
import Popup from "../../../components/Popup";

import { Trash2, Plus, UserPlus, Users } from "lucide-react";

const tabs = [
  { id: "1", label: "Details" },
  { id: "2", label: "Subjects" },
  { id: "3", label: "Students" }
];

const ClassDetails = () => {
  const { id: classID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { subjectsList, sclassStudents, sclassDetails, loading, response, getresponse } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"));
    dispatch(getSubjectList(classID, "ClassSubjects"));
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

  const [activeTab, setActiveTab] = useState("1");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, type) => {
    console.log(deleteID, type);
    setMessage("Sorry, the delete function has been disabled for now.");
    setShowPopup(true);
  };

  const subjectColumns = [
    { id: 'name', label: 'Subject Name', minWidth: 170 },
    { id: 'code', label: 'Subject Code', minWidth: 100 },
  ];

  const subjectRows = subjectsList?.map(subject => ({
    name: subject.subName,
    code: subject.subCode,
    id: subject._id
  })) || [];

  const SubjectsButtonHaver = ({ row }) => (
    <div className="flex gap-2">
      <button onClick={() => deleteHandler(row.id, "Subject")} className="text-red-500 hover:text-red-700">
        <Trash2 className="w-5 h-5" />
      </button>
      <BlueButton onClick={() => navigate(`/Admin/class/subject/${classID}/${row.id}`)}>View</BlueButton>
    </div>
  );

  const studentColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
  ];

  const studentRows = sclassStudents?.map(student => ({
    name: student.name,
    rollNum: student.rollNum,
    id: student._id
  })) || [];

  const StudentsButtonHaver = ({ row }) => (
    <div className="flex gap-2">
      <button onClick={() => deleteHandler(row.id, "Student")} className="text-red-500 hover:text-red-700">
        <Trash2 className="w-5 h-5" />
      </button>
      <BlueButton onClick={() => navigate("/Admin/students/student/" + row.id)}>View</BlueButton>
      <PurpleButton onClick={() => navigate("/Admin/students/student/attendance/" + row.id)}>Attendance</PurpleButton>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Class Details</h2>
            <p className="text-lg">This is Class <span className="font-semibold">{sclassDetails?.sclassName}</span></p>
            <p>Number of Subjects: {subjectsList.length}</p>
            <p>Number of Students: {sclassStudents.length}</p>
            <div className="flex gap-4 mt-4 flex-wrap">
              {getresponse && (
                <GreenButton onClick={() => navigate("/Admin/class/addstudents/" + classID)}>Add Students</GreenButton>
              )}
              {response && (
                <GreenButton onClick={() => navigate("/Admin/addsubject/" + classID)}>Add Subjects</GreenButton>
              )}
            </div>
          </div>
        );
      case "2":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Subjects List</h2>
              <div className="flex gap-2">
                <button onClick={() => navigate("/Admin/addsubject/" + classID)} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <Plus className="w-4 h-4" /> Add
                </button>
                <button onClick={() => deleteHandler(classID, "SubjectsClass")} className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  <Trash2 className="w-4 h-4" /> Delete All
                </button>
              </div>
            </div>
            <TableTemplate buttonHaver={SubjectsButtonHaver} columns={subjectColumns} rows={subjectRows} />
          </div>
        );
      case "3":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Students List</h2>
              <div className="flex gap-2">
                <button onClick={() => navigate("/Admin/class/addstudents/" + classID)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  <UserPlus className="w-4 h-4" /> Add
                </button>
                <button onClick={() => deleteHandler(classID, "StudentsClass")} className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  <Trash2 className="w-4 h-4" /> Delete All
                </button>
              </div>
            </div>
            <TableTemplate buttonHaver={StudentsButtonHaver} columns={studentColumns} rows={studentRows} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 py-6">
      {loading ? (
        <div className="text-center text-gray-500 text-lg">Loading...</div>
      ) : (
        <>
          <div className="sticky top-0 bg-white z-10 border-b mb-6">
            <div className="flex gap-2 sm:gap-4 p-4 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
            {renderTabContent()}
          </div>
        </>
      )}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default ClassDetails;
