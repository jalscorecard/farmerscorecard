import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import sections from './sections';

function Preview({ form, onEdit, onSubmit }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const getAnswerLabel = (q, value) => {
    if (value === null || value === undefined || value === '') return '-';

    if (q.notApplicableValue !== undefined && value === q.notApplicableValue) {
      return 'Not Applicable';
    }

    const index = Number(value);
    if (isNaN(index) || index < 0 || !q.options || index >= q.options.length) return '-';

    return `${index} - ${q.options[index]}`;
  };

  const userDetails = [
    { label: 'Full Name', value: form.fullName || '-' },
    { label: 'Email', value: form.email || '-' },
    { label: 'Whatsapp Number', value: form.whatsapp || '-' },
    { label: 'Date of Assessment', value: form.date || '-' },
    { label: 'Gender', value: form.gender || '-' },
    { label: 'Date of Birth', value: form.dob || '-' },
    { label: 'Aadhar Card Number', value: form.aadhar || '-' },
    { label: 'Farm Name', value: form.farmName || '-' },
    { label: 'Google Map Link', value: form.mapLink || '-' },
    { label: 'Plots Count', value: form.plotsCount !== undefined ? form.plotsCount : '-' }
  ];

  const handleSubmit = () => {
    setConfirmOpen(false);
    if (!form.fullName || !form.email) {
      alert("Full Name and Email are required.");
      return;
    }

    try {
      const cleanForm = {
        fullName: form.fullName || '',
        email: form.email || '',
        whatsapp: form.whatsapp || '',
        date: form.date || '',
        farmName: form.farmName || '',
        mapLink: form.mapLink || '',
        plotsCount: form.plotsCount !== undefined ? Number(form.plotsCount) : null,
        gender: form.gender || '',
        dob: form.dob || '',
        aadhar: form.aadhar || '',
        ...sections.reduce((acc, section) => {
          section.questions.forEach(q => {
            acc[q.key] = form[q.key] !== undefined ? Number(form[q.key]) : null;
          });
          return acc;
        }, {}),
        score_soil_health: form.score_soil_health !== undefined ? Number(form.score_soil_health) : null,
        score_biodiversity: form.score_biodiversity !== undefined ? Number(form.score_biodiversity) : null,
        score_pest_management: form.score_pest_management !== undefined ? Number(form.score_pest_management) : null,
        score_water_management: form.score_water_management !== undefined ? Number(form.score_water_management) : null,
        score_livestock: form.score_livestock !== undefined ? Number(form.score_livestock) : null
      };

      onSubmit(cleanForm);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to prepare form data. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 5, width: '100%', maxWidth: '800px', borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Preview Your Submission
        </Typography>

        {/* User Details Section */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Farmer Details
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableBody>
                {userDetails.map(({ label, value }) => (
                  <TableRow key={label}>
                    <TableCell sx={{ fontWeight: 600, width: '30%' }}>{label}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Sections & Answers */}
        {sections.map(section => (
          <Box key={section.title} sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontWeight: 500 }}>
              {section.title}
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Question</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Selected Answer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {section.questions.map(q => (
                    <TableRow key={q.key}>
                      <TableCell>{q.label}</TableCell>
                      <TableCell>{getAnswerLabel(q, form[q.key])}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        {/* Buttons */}
        <Box sx={{ mt: 10, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="primary" onClick={onEdit}>
            Edit your response
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => setConfirmOpen(true)}
            disabled={!form.fullName || !form.email}
          >
            Submit
          </Button>
        </Box>

        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogContent sx={{ mt: 1, mb: 1 }}>
            Are you sure you want to submit this form and view your results?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              color="success"
              variant="contained"
              onClick={handleSubmit}
            >
              Confirm Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default Preview;
