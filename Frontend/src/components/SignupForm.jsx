import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constants";
import {
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";

const SignupSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
    gender: "",
    agreedToTerms: false,
  });
  const [submittedName, setSubmittedName] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({ ...formData, [name]: newValue });

    // Validate password format dynamically
    if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value)) {
        setErrors({
          ...errors,
          [name]:
            "Password must include at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters.",
        });
      } else {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate form
    if (!formData.username) newErrors.username = "Please enter your username.";
    if (!formData.fullName) newErrors.fullName = "Please enter your full name.";
    if (!formData.email) newErrors.email = "Please enter your email.";
    if (!formData.password) newErrors.password = "Please enter your password.";
    if (!formData.repeatPassword)
      newErrors.repeatPassword = "Please repeat your password.";
    if (!formData.role) newErrors.role = "Please select your role.";
    if (!formData.gender) newErrors.gender = "Please select your gender.";
    if (formData.password !== formData.repeatPassword)
      newErrors.repeatPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/usersData`, formData);
      setSubmittedName(formData.fullName);
      setShowMessage(true);
      setFormData({
        username: "",
        fullName: "",
        email: "",
        password: "",
        repeatPassword: "",
        role: "",
        gender: "",
        agreedToTerms: false,
      });

      setTimeout(() => {
        alert("Redirecting to sign-in page...");
        navigate("/signin");
      }, 500);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f5f7",
        p: 2,
      }}
    >
      <Card sx={{ width: "80%", maxWidth: 1200, borderRadius: 3 }}>
        <Grid container>
          {/* Left Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              bgcolor: "white",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              objectFit: "cover",
            }}
          >
            <img
              src="https://png.pngtree.com/thumb_back/fw800/background/20240414/pngtree-a-boy-study-in-his-table-image_15715183.jpg"
              alt="bg-img"
              className="img-set"
            />
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" mb={2}>
                Sign Up
              </Typography>
              <form onSubmit={handleSubmit}>
                {/* Username */}
                <TextField
                  fullWidth
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.username}
                  helperText={errors.username}
                />

                {/* Full Name */}
                <TextField
                  fullWidth
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  label="Full Name"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                />

                {/* Email */}
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email"
                  type="email"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email}
                />

                {/* Password */}
                <TextField
                  fullWidth
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password}
                />

                {/* Repeat Password */}
                <TextField
                  fullWidth
                  name="repeatPassword"
                  value={formData.repeatPassword}
                  onChange={handleChange}
                  label="Repeat Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  error={!!errors.repeatPassword}
                  helperText={errors.repeatPassword}
                />

                {/* Role */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    error={!!errors.role}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="faculty">Faculty</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                  {errors.role && (
                    <Typography color="error">{errors.role}</Typography>
                  )}
                </FormControl>

                {/* Gender */}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    error={!!errors.gender}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {errors.gender && (
                    <Typography color="error">{errors.gender}</Typography>
                  )}
                </FormControl>

                {/* Terms */}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      required
                    />
                  }
                  label="I agree to the Terms of Service"
                />
                <p>
                  If Already Register{" "}
                  <Link to="/signin" style={{ margin: "0px", color: "blue" }}>
                    Log in
                  </Link>
                </p>

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                >
                  Register
                </Button>

                {showMessage && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Thank you, {submittedName}, for signing up!
                  </Alert>
                )}
              </form>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default SignupSection;
