import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import bannerImage from "../assets/banner.png";

// Helpers
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const getColorForScore = (score) => {
  if (score < 1) return "#e74c3c";
  else if (score < 2) return "#f39c12";
  else return "#27ae60";
};

const calculateSectionScore = (section, form) => {
  let total = 0, count = 0;
  section.questions.forEach((q) => {
    const val = form[q.key];
    if (!(q.notApplicableValue && val === q.notApplicableValue)) {
      const numVal = Number(val);
      if (!isNaN(numVal)) {
        total += numVal;
        count++;
      }
    }
  });
  return { score: total, count };
};

const calculateOverallAverage = (form, sections) => {
  let total = 0, count = 0;
  sections.forEach((section) =>
    section.questions.forEach((q) => {
      const val = form[q.key];
      if (!(q.notApplicableValue && val === q.notApplicableValue)) {
        const numVal = Number(val);
        if (!isNaN(numVal)) {
          total += numVal;
          count++;
        }
      }
    })
  );
  return { avg: count > 0 ? total / count : 0 };
};

const getMaturityLevel = (score) => {
  if (score < 1) return "Front Runner";
  else if (score < 2) return "Performer";
  else return "Achiever";
};

const getImageBase64 = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

const generatePdfBlob = async (form, sections) => {
  const pdf = new jsPDF("p", "pt");
  const pageWidth = pdf.internal.pageSize.getWidth();

  const bannerBase64 = await getImageBase64(bannerImage);
  if (bannerBase64) {
    pdf.addImage(bannerBase64, "PNG", 0, 0, pageWidth, 100);
  }

  let y = bannerBase64 ? 120 : 40;

  const { avg } = calculateOverallAverage(form, sections);
  const maturity = getMaturityLevel(avg);
  const overallColor = getColorForScore(avg);

  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Name: ${form.fullName || "N/A"}`, pageWidth / 2, y, { align: "center" });
  y += 20;
  pdf.text(`Email: ${form.email || "N/A"}`, pageWidth / 2, y, { align: "center" });
  y += 20;

  pdf.setFillColor(...Object.values(hexToRgb(overallColor)));
  pdf.setTextColor(255, 255, 255);
  pdf.rect(40, y, pageWidth - 80, 50, "F");
  pdf.text(`Overall Average Score: ${avg.toFixed(2)}`, pageWidth / 2, y + 18, { align: "center" });
  pdf.text(`Maturity Level: ${maturity}`, pageWidth / 2, y + 38, { align: "center" });
  y += 70;

  for (const section of sections) {
    const { score, count } = calculateSectionScore(section, form);
    const sectionAvg = count > 0 ? score / count : 0;
    const sectionColor = getColorForScore(sectionAvg);
    const rgb = hexToRgb(sectionColor);

    if (y + 35 + section.questions.length * 25 > pdf.internal.pageSize.getHeight() - 40) {
      pdf.addPage();
      y = 40;
    }

    pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    pdf.setTextColor(255, 255, 255);
    pdf.rect(40, y, pageWidth - 80, 25, "F");
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.text(section.title, 50, y + 17);
    pdf.text(`Average Score: ${sectionAvg.toFixed(2)}`, pageWidth - 50, y + 17, { align: "right" });
    y += 35;

    const body = section.questions.map((q) => {
      const val = form[q.key];
      if (q.notApplicableValue && val === q.notApplicableValue) {
        return [q.label, "Not Applicable", "-"];
      }
      const numVal = Number(val);
      const optionLabel = q.options?.[numVal] ?? "No response";
      return [q.label, optionLabel, !isNaN(numVal) ? numVal : "-"];
    });

    autoTable(pdf, {
      startY: y,
      head: [["Question", "Response", "Score"]],
      body,
      margin: { left: 40, right: 40 },
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 5 },
    });

    y = pdf.lastAutoTable.finalY + 30;
  }

  return pdf.output("blob");
};

const downloadPdf = async (form, sections) => {
  const blob = await generatePdfBlob(form, sections);
  const fileName = `${form.fullName || "Water Scorecard"} Report.pdf`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
};

const sendPdfToBackend = async (form, sections) => {
  try {
    const blob = await generatePdfBlob(form, sections);
    const fileName = `${form.fullName || "Water Scorecard"} Report.pdf`;
    const formData = new FormData();
    formData.append("pdf", new File([blob], fileName, { type: "application/pdf" }));
    formData.append("email", form.email);

    const res = await fetch("http://localhost:5000/api/send-pdf-email", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to send email");
  } catch (err) {
    console.error("Error sending PDF to backend", err);
  }
};

export {
  generatePdfBlob,
  downloadPdf,
  sendPdfToBackend,
  calculateOverallAverage,
  getMaturityLevel,
  getColorForScore,
};
