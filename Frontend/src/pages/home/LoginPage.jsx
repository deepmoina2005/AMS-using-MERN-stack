import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/userRelated/userHandle";
import { CircularProgress } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import Popup from "../../components/Popup";

const LoginPage = ({ role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rollNumber: "",
    studentName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    if (role === "Student") {
      const { rollNumber, studentName, password } = formData;
      if (!rollNumber || !studentName || !password) return;
      dispatch(loginUser({ rollNum: rollNumber, studentName, password }, role));
    } else {
      const { email, password } = formData;
      if (!email || !password) return;
      dispatch(loginUser({ email, password }, role));
    }
  };

  useEffect(() => {
    if (status === "success" || currentUser) {
      navigate(`/${currentRole}/dashboard`);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, error, response, currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate(-1)} // go back one page
          className="flex items-center cursor-pointer text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      <div className="w-full max-w-md space-y-6 bg-white shadow-xl rounded-2xl p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {role} Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your dashboard by logging into your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Conditional Inputs */}
          {role === "Student" ? (
            <>
              <input
                name="rollNumber"
                type="number"
                placeholder="Roll Number"
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                name="studentName"
                type="text"
                placeholder="Name"
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </>
          ) : (
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleInputChange}
              required
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={toggle ? "text" : "password"}
              placeholder="Password"
              onChange={handleInputChange}
              required
              className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setToggle(!toggle)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              aria-label="Toggle Password"
            >
              {toggle ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <label className="flex items-center">
              <input type="checkbox" className="accent-indigo-600 w-4 h-4" />
              <span className="ml-2">Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loader}
            className="w-full flex justify-center cursor-pointer items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
          >
            {loader ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>

          {/* Signup */}
          {role === "Admin" && (
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/Adminregister"
                className="text-indigo-600 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          )}
        </form>
      </div>

      {/* Guest Loader */}
      {guestLoader && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-md flex items-center gap-3 px-5 py-3">
            <CircularProgress size={22} color="primary" />
            <span className="text-sm text-gray-700">Please wait...</span>
          </div>
        </div>
      )}

      {/* Popup */}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default LoginPage;
