import React, { useState } from "react";
import jsPDF from "jspdf";

const initialFormState = {
  fullName: "",
  email: "",
  whatsapp: "",
  date: "",
  farmName: "",
  maplink: "",
  plotsCount: "",
  q1_1: "",
  q1_2: "",
  q1_3: "",
  q2_1: "",
  q2_2: "",
  q3_1: "",
  q3_2: "",
  q4_1: "",
  q4_2: "",
  q5_1: "",
  q5_2: "",
};

const sections = [
  {
    title: "1. Soil Health Assessment",
    questions: [
      { key: "q1_1", label: "1.1 Crop cover and living roots" },
      { key: "q1_2", label: "1.2 Tillage practices" },
      { key: "q1_3", label: "1.3 Soil amendments" },
    ],
  },
  {
    title: "2. Biodiversity & Crop Management",
    questions: [
      { key: "q2_1", label: "2.1 Crop rotation" },
      { key: "q2_2", label: "2.2 Indigenous seeds" },
    ],
  },
  {
    title: "3. Pest, Disease and Input Management",
    questions: [
      { key: "q3_1", label: "3.1 Chemical pesticides" },
      { key: "q3_2", label: "3.2 Input reliance" },
    ],
  },
  {
    title: "4. Water & Soil Moisture Management",
    questions: [
      { key: "q4_1", label: "4.1 Rainwater harvesting" },
      { key: "q4_2", label: "4.2 Soil moisture" },
    ],
  },
  {
    title: "5. Integration of Livestock",
    questions: [
      { key: "q5_1", label: "5.1 Livestock integration" },
      { key: "q5_2", label: "5.2 Grazing practices" },
    ],
  },
];

function generatePdfBlob(formData, sections) {
  const doc = new jsPDF();

  let y = 10;
  doc.setFontSize(16);
  doc.text("Farmer Assessment Report", 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Full Name: ${formData.fullName || ""}`, 10, y);
  y += 7;
  doc.text(`Email: ${formData.email || ""}`, 10, y);
  y += 7;
  doc.text(`WhatsApp: ${formData.whatsapp || ""}`, 10, y);
  y += 7;
  doc.text(`Date: ${formData.date || ""}`, 10, y);
  y += 7;
  doc.text(`Farm Name: ${formData.farmName || ""}`, 10, y);
  y += 7;
  doc.text(`Map Link: ${formData.maplink || ""}`, 10, y);
  y += 7;
  doc.text(`Plots Count: ${formData.plotsCount || ""}`, 10, y);
  y += 10;

  sections.forEach((section) => {
    doc.setFontSize(14);
    doc.text(section.title, 10, y);
    y += 7;

    section.questions.forEach((q) => {
      const answer = formData[q.key] || "";
      const splitText = doc.splitTextToSize(`${q.label}: ${answer}`, 180);
      doc.setFontSize(12);
      doc.text(splitText, 12, y);
      y += splitText.length * 7;
    });

    y += 5;
  });

  return doc.output("blob");
}

export default function FarmerAssessmentForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.fullName || !formData.email) {
      setErrorMsg("Please fill in your full name and email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://farmerbackend-kzaw.onrender.com/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "Form submitted successfully!");
        setFormData(initialFormState);
      } else {
        setErrorMsg(data.message || "Failed to submit the form.");
      }
    } catch {
      setErrorMsg("Error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const pdfBlob = generatePdfBlob(formData, sections);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formData.fullName || "farmer-assessment"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Farmer Assessment Form</h2>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Full Name*:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email*:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          WhatsApp:
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>

        <label>
          Farm Name:
          <input
            type="text"
            name="farmName"
            value={formData.farmName}
            onChange={handleChange}
          />
        </label>

        <label>
          Map Link:
          <input
            type="url"
            name="maplink"
            value={formData.maplink}
            onChange={handleChange}
          />
        </label>

        <label>
          Plots Count:
          <input
            type="number"
            name="plotsCount"
            value={formData.plotsCount}
            onChange={handleChange}
            min="0"
          />
        </label>

        <fieldset>
          <legend>1. Soil Health Assessment</legend>
          <label>
            1.1 Crop cover and living roots:
            <input
              type="text"
              name="q1_1"
              value={formData.q1_1}
              onChange={handleChange}
            />
          </label>
          <label>
            1.2 Tillage practices:
            <input
              type="text"
              name="q1_2"
              value={formData.q1_2}
              onChange={handleChange}
            />
          </label>
          <label>
            1.3 Soil amendments:
            <input
              type="text"
              name="q1_3"
              value={formData.q1_3}
              onChange={handleChange}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>2. Biodiversity & Crop Management</legend>
          <label>
            2.1 Crop rotation:
            <input
              type="text"
              name="q2_1"
              value={formData.q2_1}
              onChange={handleChange}
            />
          </label>
          <label>
            2.2 Indigenous seeds:
            <input
              type="text"
              name="q2_2"
              value={formData.q2_2}
              onChange={handleChange}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>3. Pest, Disease and Input Management</legend>
          <label>
            3.1 Chemical pesticides:
            <input
              type="text"
              name="q3_1"
              value={formData.q3_1}
              onChange={handleChange}
            />
          </label>
          <label>
            3.2 Input reliance:
            <input
              type="text"
              name="q3_2"
              value={formData.q3_2}
              onChange={handleChange}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>4. Water & Soil Moisture Management</legend>
          <label>
            4.1 Rainwater harvesting:
            <input
              type="text"
              name="q4_1"
              value={formData.q4_1}
              onChange={handleChange}
            />
          </label>
          <label>
            4.2 Soil moisture:
            <input
              type="text"
              name="q4_2"
              value={formData.q4_2}
              onChange={handleChange}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>5. Integration of Livestock</legend>
          <label>
            5.1 Livestock integration:
            <input
              type="text"
              name="q5_1"
              value={formData.q5_1}
              onChange={handleChange}
            />
          </label>
          <label>
            5.2 Grazing practices:
            <input
              type="text"
              name="q5_2"
              value={formData.q5_2}
              onChange={handleChange}
            />
          </label>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      <button onClick={handleDownloadPdf} style={{ marginTop: 20 }}>
        Download PDF
      </button>
    </div>
  );
}
