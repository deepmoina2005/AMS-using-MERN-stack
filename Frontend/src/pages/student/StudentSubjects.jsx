import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "../../redux/sclassRelated/sclassHandle";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Table,
  TableBody,
  TableHead,
  Typography,
  Box,
} from "@mui/material";
import { getUserDetails } from "../../redux/userRelated/userHandle";
import CustomBarChart from "../../components/CustomBarChart";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import { StyledTableCell, StyledTableRow } from "../../components/styles";

const StudentSubjects = () => {
  const dispatch = useDispatch();
  const { subjectsList } = useSelector((state) => state.sclass);
  const { userDetails, currentUser, loading, response, error } = useSelector(
    (state) => state.user
  );

  const [subjectMarks, setSubjectMarks] = useState([]);
  const [selectedSection, setSelectedSection] = useState("table");

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student"));
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (subjectMarks.length === 0 && currentUser?.sclassName?._id) {
      dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
    }
  }, [subjectMarks, dispatch, currentUser?.sclassName?._id]);

  useEffect(() => {
    if (response) console.log(response);
    if (error) console.log(error);
  }, [response, error]);

  const sclassName = currentUser?.sclassName;

  const handleSectionChange = (event, newSection) => {
    setSelectedSection(newSection);
  };

  const renderTableSection = () => (
    <Box sx={{ mb: 10 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Subject Marks
      </Typography>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Subject</StyledTableCell>
            <StyledTableCell>Marks</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {subjectMarks.map((result, index) => {
            if (!result.subName || result.marksObtained == null) return null;
            return (
              <StyledTableRow key={index} hover>
                <StyledTableCell>{result.subName.subName}</StyledTableCell>
                <StyledTableCell>{result.marksObtained}</StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );

  const renderChartSection = () => (
    <Box sx={{ p: 3, mb: 10 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Subject Marks Chart
      </Typography>
      <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
    </Box>
  );

  const renderClassDetailsSection = () => (
    <div className="mt-12 mb-24 max-w-3xl mx-auto px-6 py-8 bg-white rounded-lg shadow-md border border-gray-200 text-center">
      <h2 className="text-3xl font-bold mb-6">Class Details</h2>
      <h3 className="text-2xl mb-4">
        Class: <span className="font-semibold">{sclassName?.sclassName || "N/A"}</span>
      </h3>

      <div className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200 max-w-3xl mx-auto">
        <h4 className="text-2xl mb-6 font-semibold text-gray-800">Subjects</h4>

        {subjectsList && subjectsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-300 rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-5 border-b border-gray-300 font-semibold text-gray-700 uppercase tracking-wide">
                    Subject Name
                  </th>
                  <th className="py-3 px-5 border-b border-gray-300 font-semibold text-gray-700 uppercase tracking-wide">
                    Subject Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjectsList.map((subject, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-100 transition-colors duration-200 cursor-pointer`}
                  >
                    <td className="py-3 px-5 border-b border-gray-300">{subject.subName}</td>
                    <td className="py-3 px-5 border-b border-gray-300">{subject.subCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No subjects found.</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {loading ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      ) : (
        <Box>
          {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
            <>
              {selectedSection === "table" && renderTableSection()}
              {selectedSection === "chart" && renderChartSection()}

              <Paper
                sx={{
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                }}
                elevation={3}
              >
                <BottomNavigation
                  value={selectedSection}
                  onChange={handleSectionChange}
                  showLabels
                >
                  <BottomNavigationAction
                    label="Table"
                    value="table"
                    icon={
                      selectedSection === "table" ? (
                        <TableChartIcon />
                      ) : (
                        <TableChartOutlinedIcon />
                      )
                    }
                  />
                  <BottomNavigationAction
                    label="Chart"
                    value="chart"
                    icon={
                      selectedSection === "chart" ? (
                        <InsertChartIcon />
                      ) : (
                        <InsertChartOutlinedIcon />
                      )
                    }
                  />
                </BottomNavigation>
              </Paper>
            </>
          ) : (
            renderClassDetailsSection()
          )}
        </Box>
      )}
    </>
  );
};

export default StudentSubjects;
