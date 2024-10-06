import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify"; // Import toast

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: 2,
};

const EditUser = ({ user, setIsEditModalOpen, updateUser }) => {
  const [formData, setFormData] = useState(user);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Normalize phone number by removing spaces
  const normalizePhoneNumber = (phone) => phone.replace(/\s+/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Normalize phone input
    const updatedValue = name === "phone" ? normalizePhoneNumber(value) : value;
    setFormData({ ...formData, [name]: updatedValue });
  };

  const validate = () => {
    const errors = {};

    // Validate name
    if (!formData.name.trim() || formData.name.length < 3) {
      errors.name = "Name is required and must be at least 3 characters.";
    }

    // Validate username
    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Enter a valid email.";
    }

    // Validate phone
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/; // Updated phone regex
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      errors.phone = "Phone is required and must be a valid phone number.";
    }

    // Validate website
    const websiteRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i; // Updated website regex
    if (formData.website && !websiteRegex.test(formData.website)) {
      errors.website = "Enter a valid URL starting with http:// or https://.";
    }

    return errors;
  };

  const updateUserData = () => {
    setLoading(true);
    return fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      updateUserData()
        .then((updatedUser) => {
          updateUser(updatedUser);
          setIsEditModalOpen(false);
          toast.success("User updated successfully!"); // Success toast
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          toast.error("Error updating user."); // Error toast
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <Modal open={true} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Edit User
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{ readOnly: true }} // Make it non-editable
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.website}
              helperText={errors.website}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default EditUser;
