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
import StudentSideBar from "./StudentSideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import StudentHomePage from "./StudentHomePage";
import StudentProfile from "./StudentProfile";
import StudentSubjects from "./StudentSubjects";
import ViewStdAttendance from "./ViewStdAttendance";
import StudentComplain from "./StudentComplain";
import Logout from "../home/Logout";
import AccountMenu from "../../components/AccountMenu";
import { AppBar, Drawer } from "../../components/styles";
import { useSelector } from "react-redux";

const StudentDashboard = () => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Box className="flex">
      <CssBaseline />

      {/* Top Navbar */}
      <AppBar
        position="absolute"
        open={open}
        className="bg-blue-700 text-white shadow-md"
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
            noWrap
            sx={{ flexGrow: 1 }}
            className="text-white text-lg font-semibold"
          >
            Student Dashboard
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
        <Toolbar sx={styles.toolBarStyled} className="flex justify-center text-center w-full">
          <div className="text-sm text-center text-blue-700 font-semibold">
            <span className="text-gray-900">Hi</span> {currentUser.name}
          </div>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <StudentSideBar />
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={styles.boxStyled}
        className="bg-gray-100 min-h-screen w-full overflow-auto"
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<StudentHomePage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/Student/dashboard" element={<StudentHomePage />} />
          <Route path="/Student/profile" element={<StudentProfile />} />
          <Route path="/Student/subjects" element={<StudentSubjects />} />
          <Route path="/Student/attendance" element={<ViewStdAttendance />} />
          <Route path="/Student/complain" element={<StudentComplain />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default StudentDashboard;

// Styles for MUI sx props
const styles = {
  boxStyled: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  toolBarStyled: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
