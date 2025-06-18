import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector(state => state.complain);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getAllComplains(currentUser._id, "Complain"));
    }
  }, [currentUser?._id, dispatch]);

  if (error) {
    console.error(error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  const complainRows = Array.isArray(complainsList) && complainsList.length > 0
    ? complainsList.map(complain => {
        const date = new Date(complain.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
          user: complain.user.name,
          complaint: complain.complaint,
          date: dateString,
          id: complain._id,
        };
      })
    : [];

  return (
    <div className="w-full px-6 py-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-700">Loading...</div>
        ) : response ? (
          <div className="text-center text-gray-600 mt-4 font-semibold">
            No Complains Right Now
          </div>
        ) : (
          <>
            {complainRows.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full text-left text-gray-700 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      {complainColumns.map(({ id, label }) => (
                        <th key={id} className="px-6 py-3 font-semibold">{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {complainRows.map(({ id, user, complaint, date }) => (
                      <tr key={id} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{user}</td>
                        <td className="px-6 py-4">{complaint}</td>
                        <td className="px-6 py-4">{date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12 font-semibold">
                No complains available.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SeeComplains;