import { useSelector } from "react-redux";

const AdminProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-800">
              Name: <span className="font-normal">{currentUser.name}</span>
            </h2>
            <h2 className="text-xl font-bold text-gray-800">
              Email: <span className="font-normal">{currentUser.email}</span>
            </h2>
            <h2 className="text-xl font-bold text-gray-800">
              School: <span className="font-normal">{currentUser.schoolName}</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;