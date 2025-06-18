import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "../../../redux/userRelated/userHandle";
import { underControl } from "../../../redux/userRelated/userSlice";
import { CircularProgress } from "@mui/material";
import Popup from "../../../components/Popup";

const AddClass = () => {
  const [sclassName, setSclassName] = useState("");
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, tempDetails } = useSelector(
    (state) => state.user
  );

  const adminID = currentUser?._id;
  const address = "Sclass";

  const fields = {
    sclassName,
    adminID,
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === "added" && tempDetails) {
      navigate("/Admin/classes/class/" + tempDetails._id);
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
  }, [status, navigate, error, response, dispatch, tempDetails]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-lg bg-white shadow-xl border border-gray-200 rounded-lg p-8">
          <div className="flex justify-center mb-6">
          </div>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Create a New Class
          </h2>

          <form onSubmit={submitHandler} className="space-y-5">
            <input
              type="text"
              placeholder="Enter class name"
              value={sclassName}
              onChange={(e) => setSclassName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loader}
              className="w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loader ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Create"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              Go Back
            </button>
          </form>
        </div>
      </div>

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddClass;
