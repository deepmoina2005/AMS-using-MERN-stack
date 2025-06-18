import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "../redux/noticeRelated/noticeHandle";
import TableViewTemplate from "./TableViewTemplate";

const SeeNotice = () => {
  const dispatch = useDispatch();

  const { currentUser, currentRole } = useSelector((state) => state.user);
  const { noticesList, loading, error, response } = useSelector(
    (state) => state.notice
  );

  useEffect(() => {
    if (!currentUser) return; // Ensure currentUser is loaded before dispatching

    if (currentRole === "Admin") {
      if (currentUser._id) {
        dispatch(getAllNotices(currentUser._id, "Notice"));
      }
    } else if (currentUser.school && currentUser.school._id) {
      dispatch(getAllNotices(currentUser.school._id, "Notice"));
    }
  }, [dispatch, currentRole, currentUser]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-40 text-xl text-gray-700">
        Loading user info...
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div className="flex justify-center items-center h-40 text-xl text-red-600">
        Error loading notices.
      </div>
    );
  }

  const noticeColumns = [
    { id: "title", label: "Title", minWidth: 170 },
    { id: "details", label: "Details", minWidth: 100 },
    { id: "date", label: "Date", minWidth: 170 },
  ];

  const noticeRows = Array.isArray(noticesList)
    ? noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString =
          date.toString() !== "Invalid Date"
            ? date.toISOString().substring(0, 10)
            : "Invalid Date";
        return {
          title: notice.title,
          details: notice.details,
          date: dateString,
          id: notice._id,
        };
      })
    : [];

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-40 text-xl text-gray-700">
          Loading...
        </div>
      ) : response ? (
        <div className="flex justify-center items-center h-40 text-xl text-gray-500">
          No Notices to Show Right Now
        </div>
      ) : (
        <>
          <h3 className="text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
            Notices
          </h3>

          {Array.isArray(noticesList) && noticesList.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-md">
              <TableViewTemplate columns={noticeColumns} rows={noticeRows} />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8 text-lg">
              No notices found.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SeeNotice;
