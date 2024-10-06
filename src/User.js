import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Modal,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import CreateUser from "./Form"; // Assuming you have a CreateUser component
import EditUser from "./EditUser"; // Assuming you have an EditUser component
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch the initial user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    toast.success("User added successfully!");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsEditModalOpen(false);
    toast.success("User updated successfully!");
  };

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setIsDeleteModelOpen(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${userToDelete.id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userToDelete.id)
          );
          setIsDeleteModelOpen(false);
          toast.success("User deleted successfully!");
        }
      } catch (error) {
        console.error("Error deleting user", error);
        toast.error("Failed to delete user.");
      }
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <CreateUser addUser={addUser} />
      <TextField
        variant="outlined"
        label="Search by Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth={false}
        margin="normal"
      />

      <div style={{ overflowX: "auto", marginTop: "16px" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Name
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Username
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Email
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Phone
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Website
                </th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", // Alternating row colors
                  }}
                >
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {user.id}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {user.name}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {user.username}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {user.email}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {user.phone}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {user.website}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    <Button
                      onClick={() => handleEditUser(user)}
                      variant="contained"
                      color="primary"
                      style={{ marginRight: "8px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteConfirmation(user)}
                      variant="contained"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {isEditModalOpen && (
        <EditUser
          user={selectedUser}
          setIsEditModalOpen={setIsEditModalOpen}
          updateUser={updateUser}
        />
      )}
      {isDeleteModelOpen && (
        <Modal open={true} onClose={() => setIsDeleteModelOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">Confirm Deletion</Typography>
            <Typography>
              Are you sure you want to delete {userToDelete?.name}?
            </Typography>
            <Button
              onClick={handleDeleteUser}
              variant="contained"
              color="error"
              style={{ marginRight: "8px" }}
            >
              Delete
            </Button>
            <Button onClick={() => setIsDeleteModelOpen(false)}>Cancel</Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default UserList;
