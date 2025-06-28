import React, { useState } from "react";

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
    } catch (err) {
      setErrorMsg("Error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Farmer Assessment Form</h2>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <form onSubmit={handleSubmit}>

        {/* Basic farmer info */}
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

        {/* Soil Health Assessment */}
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

        {/* Biodiversity & Crop Management */}
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

        {/* Pest, Disease and Input Management */}
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

        {/* Water & Soil Moisture Management */}
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

        {/* Integration of Livestock */}
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
    </div>
  );
}
