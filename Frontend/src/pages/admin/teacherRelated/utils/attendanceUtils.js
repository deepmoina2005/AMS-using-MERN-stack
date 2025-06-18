// utils/attendanceUtils.js

export const calculateTotalSessions = (students, subjectID) => {
  if (!students || students.length === 0 || !subjectID) return 0;

  const datesSet = new Set();

  students.forEach((student) => {
    if (student.attendance && Array.isArray(student.attendance)) {
      student.attendance.forEach((att) => {
        if (
          att.subName === subjectID ||
          (typeof att.subName === "object" && att.subName?._id === subjectID)
        ) {
          if (att.date) {
            datesSet.add(att.date);
          }
        }
      });
    }
  });

  return datesSet.size;
};