import "./App.css";
import UserList from "./User";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CreateUser from "./Form";
import { AppBar, Toolbar, Typography, Button } from "@mui/material"; // Import Material-UI components

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              User Management
            </Typography>
            <Button color="inherit" component={Link} to="/">
              User List
            </Button>
            <Button color="inherit" component={Link} to="/create-user">
              Create User
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route
            path="/create-user"
            element={<CreateUser addUser={() => {}} />}
          />
        </Routes>

        {/* Toast Container for Notifications */}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
