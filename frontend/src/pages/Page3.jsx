import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

function Page3({ onNext, onBack, form }) {
  const [data, setData] = useState({
    farmName: form.farmName || '',
    mapLink: form.mapLink || '',
    area: form.area || '',
    plotsCount: form.plotsCount || ''
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateField = (name, value) => {
    switch (name) {
      case "mapLink":
        if (value.trim() !== "" && 
            !/^https?:\/\/(www\.)?(google\.com\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/.test(value)
        ) {
          return "Please enter a valid Google Maps link";
        }
        return "";
      case "farmName":
      case "area":
      case "plotsCount":
        return value.trim() === "" ? "Required" : "";
      default:
        return "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let err = {};
    for (let key in data) {
      const validationError = validateField(key, data[key]);
      if (validationError) err[key] = validationError;
    }

    setError(err);
    if (Object.keys(err).length === 0) onNext(data);
  };

  return (
    <div>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom color="primary">
          About the Farm that is being Assessed
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name of the Farm land which is being assessed"
            name="farmName"
            value={data.farmName}
            onChange={handleChange}
            error={!!error.farmName}
            helperText={error.farmName}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Google map location link of the Farm land being assessed"
            name="mapLink"
            value={data.mapLink}
            onChange={handleChange}
            error={!!error.mapLink}
            helperText={error.mapLink}
            fullWidth
            margin="normal"
            // Remove required here to allow empty input
          />

          <TextField
            label="What is the area of the farm land being assessed? (include units)"
            name="area"
            value={data.area}
            onChange={handleChange}
            error={!!error.area}
            helperText={error.area}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Describe the current crops (current, past, or future) with timing info"
            name="plotsCount"
            value={data.plotsCount}
            onChange={handleChange}
            error={!!error.plotsCount}
            helperText={error.plotsCount}
            fullWidth
            margin="normal"
            multiline
            minRows={4}
            required
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" onClick={onBack}>
              Previous
            </Button>
            <Button variant="contained" type="submit">
              Next
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
}

export default Page3;
