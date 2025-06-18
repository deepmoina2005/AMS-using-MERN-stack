import { useSelector } from 'react-redux';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);

  if (response) console.log(response);
  else if (error) console.log(error);

  const sclassName = currentUser?.sclassName;
  const studentSchool = currentUser?.school;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 rounded-full bg-indigo-500 text-white flex items-center justify-center text-6xl font-bold mb-4">
            {currentUser?.name?.charAt(0) || '?'}
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-center">{currentUser?.name || 'N/A'}</h2>
          <p className="text-center text-gray-600 mb-1">
            <span className="font-semibold">Student Roll No:</span> {currentUser?.rollNum || 'N/A'}
          </p>
          <p className="text-center text-gray-600 mb-1">
            <span className="font-semibold">Class:</span> {sclassName?.sclassName || 'N/A'}
          </p>
          <p className="text-center text-gray-600">
            <span className="font-semibold">School:</span> {studentSchool?.schoolName || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
