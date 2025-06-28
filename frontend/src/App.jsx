import React, { useRef, useState, useCallback } from "react";
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Start from "./pages/Start";
import Page2 from "./pages/Page2";
import Page3 from "./pages/Page3";
import Page4 from "./pages/Page4";
import Page5 from "./pages/Page5";
import Page6 from "./pages/Page6";
import Page7 from "./pages/Page7";
import Page8 from "./pages/Page8";
import Preview from "./pages/Preview";
import Banner from "./components/Banner";
import Success from "./pages/Success";
import sections from "./pages/sections";

const steps = [
  "Start",
  "Farmer Details",
  "Farm Assessment",
  "Soil Health",
  "Biodiversity",
  "Pest Management",
  "Water & Soil",
  "Livestock",
  "Preview",
  "Success",
];

function getDefaultForm() {
  return {
    fullName: "",
    email: "",
    whatsapp: "",
    date: "",
    farmName: "",
    mapLink: "",
    plotsCount: null,
    q1_1: null,
    q1_2: null,
    q1_3: null,
    q2_1: null,
    q2_2: null,
    q3_1: null,
    q3_2: null,
    q4_1: null,
    q4_2: null,
    q5_1: null,
    q5_2: null,
  };
}

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(getDefaultForm());
  const [clearDialog, setClearDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNext = useCallback((data = {}) => {
    setForm((prev) => ({ ...prev, ...data }));
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    scrollToTop();
  }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
    scrollToTop();
  }, []);

  const handleClear = () => setClearDialog(true);
  const confirmClear = () => {
    setForm(getDefaultForm());
    setActiveStep(0);
    setClearDialog(false);
    setIsEditing(false);
  };
  const cancelClear = () => setClearDialog(false);
  const handleRestart = () => {
    setForm(getDefaultForm());
    setActiveStep(0);
    setIsEditing(false);
  };

  const handleSubmitDetailedForm = async () => {
    setIsSubmitting(true);
    try {
      const average = (values) => {
        const valid = values.filter((v) => typeof v === "number");
        if (valid.length === 0) return 0;
        return valid.reduce((sum, v) => sum + v, 0) / valid.length;
      };

      const submissionData = {
        fullName: form.fullName,
        email: form.email,
        whatsapp: form.whatsapp,
        date: form.date || new Date().toISOString(),
        farmName: form.farmName,
        mapLink: form.mapLink,
        plotsCount: form.plotsCount,
        q1_1: form.q1_1,
        q1_2: form.q1_2,
        q1_3: form.q1_3,
        q2_1: form.q2_1,
        q2_2: form.q2_2,
        q3_1: form.q3_1,
        q3_2: form.q3_2,
        q4_1: form.q4_1,
        q4_2: form.q4_2,
        q5_1: form.q5_1,
        q5_2: form.q5_2,
        score_soil_health: average([form.q1_1, form.q1_2, form.q1_3]),
        score_biodiversity: average([form.q2_1, form.q2_2]),
        score_pest_management: average([form.q3_1, form.q3_2]),
        score_water_management: average([form.q4_1, form.q4_2]),
        score_livestock: average([form.q5_1, form.q5_2]),
      };

      const response = await fetch("http://localhost:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Submission failed");

      setActiveStep(steps.length - 1);
      scrollToTop();
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  const getStepContent = (step) => {
    const pageProps = {
      onNext: handleNext,
      onBack: handleBack,
      form,
      setForm,
      sections,
    };

    switch (step) {
      case 0:
        return <Start onNext={handleNext} />;
      case 1:
        return <Page2 {...pageProps} />;
      case 2:
        return <Page3 {...pageProps} />;
      case 3:
        return <Page4 {...pageProps} />;
      case 4:
        return <Page5 {...pageProps} />;
      case 5:
        return <Page6 {...pageProps} />;
      case 6:
        return <Page7 {...pageProps} />;
      case 7:
        return <Page8 {...pageProps} />;
      case 8:
        return (
          <Preview
            form={form}
            onEdit={() => {
              setActiveStep(1);
              setIsEditing(true);
            }}
            onSubmit={handleSubmitDetailedForm}
            sections={sections}
            isSubmitting={isSubmitting}
          />
        );
      case 9:
        return (
          <Success form={form} onRestart={handleRestart} sections={sections} />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {activeStep !== 0 && activeStep !== steps.length - 1 && <Banner />}

      {activeStep !== steps.length - 1 && (
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() =>
                  isEditing &&
                  index > 0 &&
                  index < steps.length - 1 &&
                  setActiveStep(index)
                }
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      <Box sx={{ mt: 4 }} ref={formRef}>
        {getStepContent(activeStep)}
      </Box>

      {activeStep > 0 && activeStep < steps.length - 1 && (
        <Box
          sx={{
            mt: 2,
            mb: 7,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button color="error" variant="outlined" onClick={handleClear}>
            Clear Form
          </Button>
        </Box>
      )}

      <Dialog open={clearDialog} onClose={cancelClear}>
        <DialogTitle>Clear Form</DialogTitle>
        <DialogContent>This will clear all form data.</DialogContent>
        <DialogActions>
          <Button onClick={cancelClear}>Cancel</Button>
          <Button color="error" onClick={confirmClear}>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
