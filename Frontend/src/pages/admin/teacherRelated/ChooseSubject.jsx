import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherFreeClassSubjects } from "../../../redux/sclassRelated/sclassHandle";
import { updateTeachSubject } from "../../../redux/teacherRelated/teacherHandle";

const ChooseSubject = ({ situation }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [classID, setClassID] = useState("");
  const [teacherID, setTeacherID] = useState("");
  const [loader, setLoader] = useState(false);

  const { subjectsList, loading, error, response } = useSelector(
    (state) => state.sclass
  );

  useEffect(() => {
    if (situation === "Norm") {
      setClassID(params.id);
      dispatch(getTeacherFreeClassSubjects(params.id));
    } else if (situation === "Teacher") {
      const { classID, teacherID } = params;
      setClassID(classID);
      setTeacherID(teacherID);
      dispatch(getTeacherFreeClassSubjects(classID));
    }
  }, [situation, params, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (response) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 px-6">
        <h1 className="text-xl font-semibold text-center text-gray-800">
          Sorry, all subjects have teachers assigned already
        </h1>
        <button
          onClick={() => navigate("/Admin/addsubject/" + classID)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded shadow transition"
        >
          Add Subjects
        </button>
      </div>
    );
  }

  if (error) {
    console.error(error);
  }

  const updateSubjectHandler = (teacherId, teachSubject) => {
    setLoader(true);
    dispatch(updateTeachSubject(teacherId, teachSubject));
    navigate("/Admin/teachers");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Choose a subject</h2>

        {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Subject Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Subject Code
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjectsList.map((subject, index) => (
                  <tr
                    key={subject._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                      {subject.subName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                      {subject.subCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {situation === "Norm" ? (
                        <button
                          onClick={() =>
                            navigate("/Admin/teachers/addteacher/" + subject._id)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded shadow transition"
                        >
                          Choose
                        </button>
                      ) : (
                        <button
                          onClick={() => updateSubjectHandler(teacherID, subject._id)}
                          disabled={loader}
                          className={`${
                            loader
                              ? "bg-green-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          } text-white font-semibold py-1 px-4 rounded shadow transition`}
                        >
                          {loader ? (
                            <svg
                              className="animate-spin h-5 w-5 mx-auto text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          ) : (
                            "Choose Sub"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No subjects found.</p>
        )}
      </div>
    </div>
  );
};

export default ChooseSubject;
