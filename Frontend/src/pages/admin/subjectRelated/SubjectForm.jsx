import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { CircularProgress } from "@mui/material";
import Popup from "../../../components/Popup";

const SubjectForm = () => {
  const [subjects, setSubjects] = useState([
    { subName: "", subCode: ""},
  ]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { status, currentUser, response, error } = useSelector(
    (state) => state.user
  );

  const sclassName = params.id;
  const adminID = currentUser?._id;
  const address = "Subject";

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const handleChange = (index, field) => (e) => {
    const updated = [...subjects];
    updated[index][field] = e.target.value;
    setSubjects(updated);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subName: "", subCode: "" }]);
  };

  const handleRemoveSubject = (index) => () => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const fields = {
    sclassName,
    subjects: subjects.map(({ subName, subCode }) => ({
      subName,
      subCode,
    })),
    adminID,
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added") {
      navigate("/Admin/subjects");
      dispatch(underControl());
      setLoader(false);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Add Subjects</h2>
        <button
          type="button"
          onClick={handleAddSubject}
          className="text-indigo-600 font-medium hover:underline"
        >
          + Add Subject
        </button>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-6 mb-6"
          >
            <input
              type="text"
              placeholder="Subject Name"
              value={subject.subName}
              onChange={handleChange(index, "subName")}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Subject Code"
              value={subject.subCode}
              onChange={handleChange(index, "subCode")}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Only show remove button for extra rows */}
            {index > 0 && (
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleRemoveSubject(index)}
                  className="text-red-600 font-medium hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loader}
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium disabled:opacity-50"
          >
            {loader ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Save Subjects"
            )}
          </button>
        </div>
      </form>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default SubjectForm;
