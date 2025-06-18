import { useState } from "react";
import {
  CssBaseline,
  Box,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TeacherSideBar from "./TeacherSideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";
import StudentAttendance from "../admin/studentRelated/StudentAttendance";
import TeacherClassDetails from "./TeacherClassDetails";
import TeacherHomePage from "./TeacherHomePage";
import TeacherProfile from "./TeacherProfile";
import TeacherViewStudent from "./TeacherViewStudent";
import StudentExamMarks from "../admin/studentRelated/StudentExamMarks";
import { useSelector } from "react-redux";
import Logout from "../home/Logout";

const TeacherDashboard = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const { currentUser } = useSelector((state) => state.user);
return (
  <>
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top App Bar */}
      <AppBar
        position="absolute"
        open={open}
        className="bg-blue-700 shadow-md"
        elevation={1}
      >
        <Toolbar className="pr-6">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Teacher Dashboard
          </Typography>

          <AccountMenu />
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={open ? styles.drawerStyled : styles.hideDrawer}
      >
        <Toolbar sx={styles.toolBarStyled} className="flex justify-between w-full">
          <div>
            <p className="text-gray-900 font-semibold text-lg">
              Hi {currentUser.name}
            </p>
          </div>

          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>

        <Divider />
        <List component="nav">
          <TeacherSideBar />
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={styles.boxStyled}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<TeacherHomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
          <Route path="/Teacher/profile" element={<TeacherProfile />} />
          <Route path="/Teacher/class" element={<TeacherClassDetails />} />
          <Route
            path="/Teacher/class/student/:id"
            element={<TeacherViewStudent />}
          />
          <Route
            path="/Teacher/class/student/attendance/:studentID/:subjectID"
            element={<StudentAttendance situation="Subject" />}
          />
          <Route
            path="/Teacher/class/student/marks/:studentID/:subjectID"
            element={<StudentExamMarks situation="Subject" />}
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Box>
    </Box>
  </>
);

};

export default TeacherDashboard;

const styles = {
  boxStyled: {
    backgroundColor: (theme) =>
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[900],
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: [1],
  },
  drawerStyled: {
    display: "flex",
  },
  hideDrawer: {
    display: "flex",
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
};