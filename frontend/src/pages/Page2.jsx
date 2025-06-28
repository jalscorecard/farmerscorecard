import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";

const formatAadhar = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  return digits.replace(/(\d{4})(\d{4})(\d{0,4})/, (_, p1, p2, p3) =>
    [p1, p2, p3].filter(Boolean).join(" ")
  );
};

function Page2({ onNext = () => {}, onBack = () => {}, form = {} }) {
  const [data, setData] = useState({
    fullName: form.fullName || "",
    email: form.email || "",
    whatsapp: form.whatsapp || "",
    date: form.date || "",
    gender: form.gender || "",
    dob: form.dob || "",
    aadhar: formatAadhar(form.aadhar || ""),
  });

  const [error, setError] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        if (!value) return "Required";
        return /^[A-Za-z\s]+$/.test(value)
          ? ""
          : "Name must contain only letters and spaces";
      case "email":
        if (!value) return "Required";
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)
          ? ""
          : "Invalid email address";
      case "whatsapp":
        if (!value) return "Required";
        return /^\d{10}$/.test(value) ? "" : "Phone must be exactly 10 digits";
      case "aadhar":
        if (!value) return "Required";
        return /^\d{4} \d{4} \d{4}$/.test(value)
          ? ""
          : "Aadhar must be in xxxx xxxx xxxx format";
      case "gender":
        return value ? "" : "Please select gender";
      case "dob":
        return value ? "" : "Date of birth required";
      case "date":
        return value ? "" : "Assessment date required";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = value;

    if (name === "aadhar") {
      cleanedValue = formatAadhar(value);
    } else if (name === "whatsapp") {
      cleanedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setData((prev) => ({ ...prev, [name]: cleanedValue }));
    setError((prev) => ({
      ...prev,
      [name]: validateField(name, cleanedValue),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(data).forEach((key) => {
      const errorMsg = validateField(key, data[key]);
      if (errorMsg) newErrors[key] = errorMsg;
    });

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext({
        ...data,
        aadhar: data.aadhar.replace(/\s/g, ""),
      });
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom color="primary">
          Farmer Registration
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Full Name"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            error={!!error.fullName}
            helperText={error.fullName}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            error={!!error.email}
            helperText={error.email}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Whatsapp Number"
            name="whatsapp"
            type="tel"
            value={data.whatsapp}
            onChange={handleChange}
            error={!!error.whatsapp}
            helperText={error.whatsapp}
            fullWidth
            margin="normal"
            inputProps={{
              maxLength: 10,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
            required
          />

          <TextField
            label="Date of Assessment"
            name="date"
            type="date"
            value={data.date}
            onChange={handleChange}
            error={!!error.date}
            helperText={error.date}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            select
            label="Gender"
            name="gender"
            value={data.gender}
            onChange={handleChange}
            error={!!error.gender}
            helperText={error.gender}
            fullWidth
            margin="normal"
            required
            SelectProps={{
              native: false,
              MenuProps: {
                PaperProps: {
                  sx: { textAlign: "left" },
                },
              },
            }}
            sx={{
              "& .MuiSelect-select": {
                textAlign: "left",
              },
            }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>

          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={data.dob}
            onChange={handleChange}
            error={!!error.dob}
            helperText={error.dob}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Aadhar Card Number"
            name="aadhar"
            value={data.aadhar}
            onChange={handleChange}
            error={!!error.aadhar}
            helperText={error.aadhar}
            fullWidth
            margin="normal"
            inputProps={{
              maxLength: 14,
              inputMode: "numeric",
            }}
            required
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button variant="contained" type="submit">
              Next
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Page2;
