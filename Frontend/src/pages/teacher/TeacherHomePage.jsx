import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { calculateTotalSessions } from './utils/attendanceUtils';

const TeacherHomePage = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { sclassStudents, loading, error } = useSelector((state) => state.sclass);

  const classID = currentUser?.teachSclass?._id;
  const subjectID = currentUser?.teachSubject?._id;

  useEffect(() => {
    if (subjectID && classID) {
      dispatch(getSubjectDetails(subjectID, 'Subject'));
      dispatch(getClassStudents(classID));
    }
  }, [dispatch, subjectID, classID]);

  const numberOfStudents = sclassStudents?.length || 0;
  const numberOfSessions = calculateTotalSessions(sclassStudents, subjectID);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <StatCard title="Class Students" value={numberOfStudents} duration={2.5} />
            <StatCard title="Total Sessions" value={numberOfSessions} duration={5} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Notices</h2>
            <SeeNotice />
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, duration, suffix }) => (
  <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center text-center h-40">
    <p className="text-lg font-medium text-gray-600 mb-2">{title}</p>
    <CountUp
      start={0}
      end={value || 0}
      duration={duration}
      suffix={suffix ? ` ${suffix}` : ''}
      className="text-3xl font-bold text-green-600"
    />
  </div>
);

export default TeacherHomePage;