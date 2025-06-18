import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../redux/userRelated/userHandle";
import Popup from "../../components/Popup";

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, currentUser, response, error, currentRole } = useSelector(
    (state) => state.user
  );

  const [toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const role = "Admin";

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.adminName.value;
    const schoolName = form.schoolName.value;
    const email = form.email.value;
    const password = form.password.value;

    const newErrors = {};
    if (!name) newErrors.adminName = "Name is required";
    if (!schoolName) newErrors.schoolName = "School name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const fields = { name, email, password, role, schoolName };
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  const handleInputChange = (e) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: false }));
  };

  useEffect(() => {
    if (
      status === "success" ||
      (currentUser !== null && currentRole === "Admin")
    ) {
      navigate("/Admin/dashboard");
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      console.log(error);
    }
  }, [status, currentUser, currentRole, navigate, error, response]);

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
      <div className="w-full max-w-lg space-y-6 bg-white shadow-xl rounded-2xl p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Admin Register
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your school by registering as an Admin. You can manage
            faculty and students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Admin Name */}
          <div>
            <input
              name="adminName"
              type="text"
              placeholder="Your Name"
              onChange={handleInputChange}
              className={`w-full bg-white border ${
                errors.adminName ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.adminName && (
              <p className="text-xs text-red-500 mt-1">{errors.adminName}</p>
            )}
          </div>

          {/* School Name */}
          <div>
            <input
              name="schoolName"
              type="text"
              placeholder="School Name"
              onChange={handleInputChange}
              className={`w-full bg-white border ${
                errors.schoolName ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.schoolName && (
              <p className="text-xs text-red-500 mt-1">{errors.schoolName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleInputChange}
              className={`w-full bg-white border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={toggle ? "text" : "password"}
              placeholder="Password"
              onChange={handleInputChange}
              className={`w-full bg-white border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-3 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <button
              type="button"
              onClick={() => setToggle(!toggle)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            >
              {toggle ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="accent-indigo-600 w-4 h-4"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loader}
              className="w-full flex justify-center cursor-pointer items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loader ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Register"
              )}
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/Adminlogin"
              className="text-indigo-600 hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>

      {/* Popup */}
      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </div>
  );
};

export default AdminRegisterPage;
