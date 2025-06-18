import { useEffect } from 'react';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import SeeNotice from '../../components/SeeNotice';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

// Lucide icons import
import { Users, ClipboardList, UserCheck } from 'lucide-react';

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser?._id;

  useEffect(() => {
    if (adminID) {
      dispatch(getAllStudents(adminID));
      dispatch(getAllSclasses(adminID, 'Sclass'));
      dispatch(getAllTeachers(adminID));
    }
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList?.length || 0;
  const numberOfClasses = sclassesList?.length || 0;
  const numberOfTeachers = teachersList?.length || 0;

  const stats = [
    {
      label: 'Total Students',
      count: numberOfStudents,
      duration: 2.5,
      icon: <Users size={48} className="text-green-600" />,
      iconBg: 'bg-green-100',
    },
    {
      label: 'Total Classes',
      count: numberOfClasses,
      duration: 5,
      icon: <ClipboardList size={48} className="text-blue-600" />,
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Total Teachers',
      count: numberOfTeachers,
      duration: 2.5,
      icon: <UserCheck size={48} className="text-purple-600" />,
      iconBg: 'bg-purple-100',
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {stats.map(({ label, count, duration, icon, iconBg }, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center justify-center space-y-4"
          >
            <div
              className={`p-4 rounded-full ${iconBg} flex items-center justify-center`}
              aria-hidden="true"
            >
              {icon}
            </div>
            <p className="text-xl font-semibold text-gray-700">{label}</p>
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
              <CountUp start={0} end={count} duration={duration} />
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8">
        <SeeNotice />
      </div>
    </div>
  );
};

export default AdminHomePage;
