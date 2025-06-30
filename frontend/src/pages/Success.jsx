import React, { useRef, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import bannerImage from "../assets/banner.png";

const sections = [
  {
    title: "1) Soil Health Assessment",
    questions: [
      {
        key: "q1_1",
        label:
          "1.1 Which one of the following best describes the crop cover and living roots in this farm?",
        options: [
          "Fields remain bare post-harvest; no cover or living roots.",
          "Occasional cover or volunteer growth left unintentionally.",
          "Cover crops used in some seasons",
          "Cover crops used intentionally and consistently on most plots.",
          "Diverse, multi-species cover crops maintained year-round for continuous soil cover and living roots",
        ],
      },
      {
        key: "q1_2",
        label:
          "1.2 Which one of the following best describes the tillage practices in this farm?",
        options: [
          "Conventional deep tillage used regularly.",
          "Occasional reduced tillage in select plots.",
          "Reduced tillage used across many.",
          "Minimum tillage applied consistently.",
          "No-till or minimal disturbance practiced with specialized tools; soil structure well-preserved.",
        ],
      },
      {
        key: "q1_3",
        label:
          "1.3 Which one of the following best describes the Soil Amendments practices in this farm?",
        options: [
          "No compost or organic inputs; only synthetic fertilizers used.",
          "Some compost used, often externally sourced.",
          "Own-farm compost applied to a few plots.",
          "Regular application of well-prepared compost/farmyard manure.",
          "Integrated system using compost, bioinputs, and soil biology enhancement (e.g.jeevamrit/vermicompost).",
        ],
      },
    ],
  },
  {
    title: "2) Biodiversity & Crop Management",
    questions: [
      {
        key: "q2_1",
        label:
          "2.1 Which one of the following best describes the Crop Rotation & Diversity practices in this farm?",
        options: [
          "Mono-cropping followed throughout.",
          "Rotation done once in a while, with limited diversity.",
          "Seasonal rotation practiced with 2 – 3 crops",
          "Intentional multi-season rotation with diverse crops.",
          "Polyculture/intercropping used, integrating trees or perennial species where possible.",
        ],
      },
      {
        key: "q2_2",
        label:
          "2.2 Which one of the following best describes the Use of Indigenous or Resilient Seeds practices in this farm?",
        options: [
          "Fully dependent on hybrid or GM seeds.",
          "One indigenous variety grown occasionally.",
          "Mix of commercial and local seeds used.",
          "Local/open-pollinated seeds preferred for most crops.",
          "Community-led seed saving and breeding practiced for diverse, climate-resilient crops.",
        ],
      },
    ],
  },
  {
    title: "3) Pest, Disease and Input Management",
    questions: [
      {
        key: "q3_1",
        label:
          "3.1 Which one of the following best describes the Use of Chemical Pesticides practices in this farm?",
        options: [
          "Regular use of chemical pesticides and herbicides.",
          "Reduced chemical sprays in some plots.",
          "Mixed use of chemicals and natural sprays.",
          "Fully transitioned to natural/bio pest control (e.g. neem, cow-based).",
          "Ecological pest management with habitat enhancement (e.g. trap crops, predators)",
        ],
      },
      {
        key: "q3_2",
        label:
          "3.2 Which one of the following best describes the Input Reliance practices in this farm?",
        options: [
          "Fully dependent on external inputs (seeds, fertilizers, pesticides).",
          "Some homemade inputs used.",
          "Use of jeevamrit/panchagavya on select plots.",
          "Most inputs prepared on-farm with natural materials.",
          "Complete input self-reliance with community-level sharing and training.",
        ],
      },
    ],
  },
  {
    title: "4) Integration of Livestock",
    questions: [
      {
        key: "q4_1",
        label:
          "4.1 Which one of the following best describes the Livestock Integration with Cropping Systems practices in this farm?",
        options: [
          "No livestock or completely separated from crops.",
          "Livestock present but not integrated into farm system.",
          "Manure used occasionally on fields",
          "Livestock and crop systems managed to support each other.",
          "Full integration: rotational grazing, manure used for composting, fodder crops grown.",
        ],
      },
      {
        key: "q4_2",
        label:
          "4.2 Which one of the following best describes the Livestock Grazing practices in this farm?",
        options: [
          "Free grazing without management.",
          "Stall-fed or tethered grazing, no rotation.",
          "Some paddock or rotational grazing practiced.",
          "Managed rotational grazing with rest periods for recovery.",
          "Holistic grazing with pasture improvement and high biomass regeneration.",
        ],
      },
    ],
  },
  {
    title: "5) Water & Soil Moisture Management",
    questions: [
      {
        key: "q5_1",
        label:
          "5.1 Which one of the following best describes the Rainwater Harvesting & Groundwater Recharge practices in this farm?",
        options: [
          "No rainwater harvesting structures.",
          "Basic bunding or trenches with minimal impact.",
          "Farm ponds or check dams on parts of the farm.",
          "Effective farm-level harvesting structures maintained.",
          "Integrated recharge system with soil moisture, ponds, and runoff control.",
        ],
      },
      {
        key: "q5_2",
        label:
          "5.2 Which one of the following best describes the Soil Moisture Conservation practices in this farm?",
        options: [
          "Water runs off quickly; no moisture management.",
          "Mulching done occasionally.",
          "Regular mulching or compost used for moisture.",
          "Water-saving practices like furrow planting adopted.",
          "Contour bunds, cover crops, mulch, and soil structure ensure year-round moisture.",
        ],
      },
    ],
  },
];

// Helper functions
function getColorForScore(score) {
  const percentage = score * 20;
  
  if (percentage <= 20) return "#e74c3c";
  if (percentage <= 40) return "#e67e22";
  if (percentage <= 60) return "#f1c40f";
  if (percentage <= 80) return "#27ae60";
  return "#2980b9";
}


function calculateSectionScore(section, form) {
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
  return count ? total / count : 0;
}

function calculateTotalScore(form) {
  let total = 0, count = 0;
  sections.forEach((section) => {
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
  });
  return count ? total / count : 0;
}

function interpolateColor(color1, color2, factor) {
  var hex = function (x) {
    x = x.toString(16);
    return x.length === 1 ? "0" + x : x;
  };

  var r1 = parseInt(color1.substring(1, 3), 16);
  var g1 = parseInt(color1.substring(3, 5), 16);
  var b1 = parseInt(color1.substring(5, 7), 16);

  var r2 = parseInt(color2.substring(1, 3), 16);
  var g2 = parseInt(color2.substring(3, 5), 16);
  var b2 = parseInt(color2.substring(5, 7), 16);

  var r = Math.round(r1 + factor * (r2 - r1));
  var g = Math.round(g1 + factor * (g2 - g1));
  var b = Math.round(b1 + factor * (b2 - b1));

  return "#" + hex(r) + hex(g) + hex(b);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function getMaturityLevel(score) {
  const percentage = score * 20;
  
  if (percentage <= 20) return "Aspirant";
  if (percentage <= 40) return "Performing Aspirant";
  if (percentage <= 60) return "Performer";
  if (percentage <= 80) return "Front Runner";
  return "Achiever";
}

const Success = ({ form, sections, onRestart }) => {
  const pdfRef = useRef(null);
  const hasSentRef = useRef(false);
  const totalScore = calculateTotalScore(form);
  const overallColor = getColorForScore(totalScore);
  const maturity = getMaturityLevel(totalScore);

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

  const addFooter = (doc) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const footerY = pageHeight - 40;
    const leftX = margin;
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const rightX = doc.internal.pageSize.getWidth() - margin;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const leftText = "Hours\nMon-Fri / 7:00 – 18:00\nSaturday / 9:00 – 17:00";
    const centerText =
      "Corporate offices\nHead Office: Amravati, Maharashtra 444602\nCorporate Office: New Delhi, Delhi 110049";
    const rightText = "Contact Info\nEmail: contact@jalsmruti.org";

    const lineSpacing = 10;

    leftText.split("\n").forEach((line, i) => {
      doc.text(
        line,
        leftX,
        footerY - (leftText.split("\n").length - 1 - i) * lineSpacing
      );
    });

    centerText.split("\n").forEach((line, i) => {
      doc.text(
        line,
        centerX,
        footerY - (centerText.split("\n").length - 1 - i) * lineSpacing,
        {
          align: "center",
        }
      );
    });

    rightText.split("\n").forEach((line, i) => {
      doc.text(
        line,
        rightX,
        footerY - (rightText.split("\n").length - 1 - i) * lineSpacing,
        {
          align: "right",
        }
      );
    });
  };

  const generatePdfBlob = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    const bannerBase64 = await getImageBase64(bannerImage);
    if (bannerBase64) {
      doc.addImage(bannerBase64, "PNG", 0, 0, pageWidth, 100);
    }
    let startY = bannerBase64 ? 120 : 40;

    const slogan =
      "Jalsmruti is empowering communities to restore India's cherished legacy — a land that was once celebrated as 'Sujalaam Sufalaam', abundant in water and lush vegetation.";

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const marginX = 40;
    const maxWidth = pageWidth - marginX * 2;
    const words = slogan.split(" ");
    let line = "";
    const lines = [];

    words.forEach((word) => {
      const testLine = line + word + " ";
      const testWidth = doc.getTextWidth(testLine);
      if (testWidth > maxWidth) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = testLine;
      }
    });
    if (line) lines.push(line.trim());

    lines.forEach((lineText, i) => {
      const y = startY + i * 18;
      const wordsInLine = lineText.split(" ");

      const lineWidth = wordsInLine.reduce((sum, word) => {
        return sum + doc.getTextWidth(word + " ");
      }, 0);

      let cursorX = (pageWidth - lineWidth) / 2;

      wordsInLine.forEach((word) => {
        if (word === "Jalsmruti") {
          doc.setTextColor(0, 102, 204); // Blue
          doc.setFont(undefined, "bold");
        } else if (
          word.includes("Sujalaam") ||
          word.includes("Sufalaam") ||
          word.includes("'Sujalaam") ||
          word.includes("Sufalaam',")
        ) {
          doc.setTextColor(0, 153, 76); // Green
          doc.setFont("helvetica", "italic");
        } else {
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        }

        const wordWidth = doc.getTextWidth(word + " ");
        doc.text(word + " ", cursorX, y);
        cursorX += wordWidth;
      });
    });

    startY += lines.length * 18 + 20;

    const overallScore = totalScore.toFixed(2);
    const maturityLevel = getMaturityLevel(totalScore);
    const { r: rO, g: gO, b: bO } = hexToRgb(overallColor);

    doc.setFillColor(rO, gO, bO);
    doc.setTextColor(255, 255, 255);
    doc.rect(40, startY, pageWidth - 80, 40, "F");

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(
       `Overall RegenerativeAgri Farm Score: ${(totalScore * 20).toFixed(0)}`,
         centerX,
         startY + 18,
         null,
         null,
         "center"
       );

    doc.setFontSize(14);
    doc.setFont(undefined, "normal");
    doc.text(`Maturity Level: ${maturityLevel}`, centerX, startY + 34, null, null, "center");

    startY += 60;

    for (let i = 0; i < 3; i++) {
      const section = sections[i];
      const sectionScore = calculateSectionScore(section, form);
      const sectionColor = getColorForScore(sectionScore);
      const { r, g, b } = hexToRgb(sectionColor);

      doc.setFillColor(r, g, b);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.rect(40, startY, pageWidth - 80, 25, "F");
      doc.text(section.title, 50, startY + 17);
      doc.text(
         `Average Score: ${(sectionScore * 25).toFixed(0)}`,
          pageWidth - 50,
          startY + 17,
          null,
          null,
          "right"
          );

      startY += 25;

      const tableRows = section.questions.map((q) => {
        const val = form[q.key];
        const answerText =
          q.notApplicableValue && val === q.notApplicableValue
            ? "Not Applicable"
            : q.options?.[val] || val || "N/A";
        return [
          q.label,
          answerText,
          q.notApplicableValue && val === q.notApplicableValue ? "-" : val,
        ];
      });

      autoTable(doc, {
        startY,
        head: [["Question", "Answer", "Score"]],
        body: tableRows,
        margin: { left: 40, right: 40 },
        theme: "grid",
        styles: {
          fontSize: 9,
          textColor: 0,
          cellPadding: 5,
          lineWidth: 0.1,
          lineColor: [50, 50, 50],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: 0,
          fontStyle: "bold",
        },
      });

      startY = doc.lastAutoTable.finalY + 28;
    }

    doc.addPage();
    startY = 40;

    for (let i = 3; i < 5; i++) {
      const section = sections[i];
      const sectionScore = calculateSectionScore(section, form);
      const sectionColor = getColorForScore(sectionScore);
      const { r, g, b } = hexToRgb(sectionColor);

      doc.setFillColor(r, g, b);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.rect(40, startY, pageWidth - 80, 25, "F");
      doc.text(section.title, 50, startY + 17);
      doc.text(
        `Average Score: ${(sectionScore * 25).toFixed(0)}`,
          pageWidth - 50,
          startY + 17,
          null,
          null,
          "right"
        );

      startY += 25;

      const tableRows = section.questions.map((q) => {
        const val = form[q.key];
        const answerText =
          q.notApplicableValue && val === q.notApplicableValue
            ? "Not Applicable"
            : q.options?.[val] || val || "N/A";
        return [
          q.label,
          answerText,
          q.notApplicableValue && val === q.notApplicableValue ? "-" : val,
        ];
      });

      autoTable(doc, {
        startY,
        head: [["Question", "Answer", "Score"]],
        body: tableRows,
        margin: { left: 40, right: 40 },
        theme: "grid",
        styles: {
          fontSize: 9,
          textColor: 0,
          cellPadding: 5,
          lineWidth: 0.1,
          lineColor: [50, 50, 50],
        },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: 0,
          fontStyle: "bold",
        },
      });

      startY = doc.lastAutoTable.finalY + 50;
    }

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("OUR SERVICES", 40, startY);
    startY += 25;

    doc.setFontSize(13);
    doc.setFont(undefined, "normal");
    const services = [
         "• Restoring soil and water health in Agri farms",
         "• Market connect of Agri Supply of Regen Agri Farmers with Corporate Demand " +
         "for Agri Inputs",
         "• Hand holding farmers to Regen farming practices",
       ];


    services.forEach((service) => {
      doc.text(service, 50, startY);
      startY += 25;
    });

    startY += 10;

    if (startY + 200 > pageHeight - 60) {
      doc.addPage();
      startY = 40;
    }

    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);

    doc.text("Donate", 40, startY);
    startY += 25;

    startY += 4;
    const text =
      "Jal Smruti Foundation is a Section 80G approved non profit entity based in India";

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const wrappedLines = doc.splitTextToSize(text, maxWidth);

    wrappedLines.forEach((line) => {
      doc.text(line, marginX, startY);
      startY += 18;
    });

    startY += 5;

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
      "Your donation to Jal Smruti Foundation is tax deductible",
      40,
      startY
    );
    startY += 30;

    doc.setFont(undefined, "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const bankHeader = "Bank Details";
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(bankHeader, 40, startY);

    const bankHeaderWidth = doc.getTextWidth(bankHeader);
    doc.line(40, startY + 2, 40 + bankHeaderWidth, startY + 2); // underline
    startY += 18;

    doc.setFont(undefined, "normal");
    const bankLines = [
      "Account Name: Jal Smruti Foundation",
      "Bank Name: State Bank of India",
      "Account Number: 40131834676",
      "Account Type: Current",
      "IFSC Code: SBIN0003866",
      "",
    ];
    bankLines.forEach((line) => {
      doc.text(line, 40, startY);
      startY += 15;
    });
    const upiLabel = "UPI:";
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.text(upiLabel, 40, startY);
    const upiLabelWidth = doc.getTextWidth(upiLabel);
    doc.line(40, startY + 2, 40 + upiLabelWidth, startY + 2);

    startY += 18;
    doc.setFont(undefined, "normal");
    doc.text("jalsmrutifoundation@ybl", 40, startY);
    startY += 20;

    addFooter(doc);

    return doc.output("blob");
  };

  const sendPdfToBackend = async () => {
    try {
      const blob = await generatePdfBlob();
      const fileName = `${
        form.fullName || "RegenerativeAgri Farm_Scorecard"
      }_Report.pdf`;
      const formData = new FormData();
      formData.append(
        "pdf",
        new File([blob], fileName, { type: "application/pdf" })
      );
      formData.append("email", form.email);
      formData.append("cc_email", "contact@jalsmruti.org");

      const res = await fetch("https://farmerbackend-kzaw.onrender.com/api/send-pdf-email", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        console.log("PDF emailed successfully");
      } else {
        console.error("Failed to send email");
      }
    } catch (err) {
      console.error("Error generating/sending PDF", err);
    }
  };

  const handleDownloadPdf = async () => {
    const blob = await generatePdfBlob();
    const fileName = `${
      form.fullName || "RegenerativeAgri Farm"
    }_Assessment_Report.pdf`;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!hasSentRef.current) {
      sendPdfToBackend();
      hasSentRef.current = true;
    }
  }, []);

  return (
    <Box sx={{ padding: 4, maxWidth: 900, margin: "auto" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Box
          component="img"
          src={bannerImage}
          alt="Banner"
          sx={{ width: "100%", maxHeight: 150, objectFit: "contain" }}
        />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
          Thank you, {form.fullName || "User"} for completing the assessment!
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: overallColor,
          color: "white",
          textAlign: "center",
          py: 2,
          mb: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Overall Farmer Agri Score: {(totalScore * 20).toFixed(0)}
        </Typography>
        <Typography variant="h6">Maturity Level: {maturity}</Typography>
      </Box>

      {sections.map((section) => {
        const sectionScore = calculateSectionScore(section, form);
        const color = getColorForScore(sectionScore);

        return (
          <Box
            key={section.title}
            sx={{
              marginBottom: 4,
              border: `2px solid ${color}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                backgroundColor: color,
                color: "white",
                p: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {section.title} (Average Score: {(sectionScore * 25).toFixed(0)})
              </Typography>
            </Box>

            <TableContainer>
              <Table size="small" aria-label={`${section.title} summary`}>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Answer</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {section.questions.map((q) => {
                    const val = form[q.key];
                    let answerText = "N/A";

                    if (val !== undefined) {
                      if (
                        q.notApplicableValue &&
                        val === q.notApplicableValue
                      ) {
                        answerText = "Not Applicable";
                      } else if (q.options) {
                        answerText = q.options[val] || val;
                      } else {
                        answerText = val;
                      }
                    }

                    return (
                      <TableRow key={q.key}>
                        <TableCell>{q.label}</TableCell>
                        <TableCell>{answerText}</TableCell>
                   <TableCell>
                      {q.notApplicableValue && val === q.notApplicableValue
                         ? "-"
                          : val !== undefined
                         ? val
                          : "N/A"}
                    </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}

      <Box
        sx={{
          textAlign: "center",
          marginTop: 4,
          padding: 2,
          borderTop: "2px solid #154360",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
          onClick={handleDownloadPdf}
        >
          Download PDF Report
        </Button>

        <Button variant="outlined" color="secondary" onClick={onRestart}>
          Submit Another Form
        </Button>
      </Box>
    </Box>
  );
};

export default Success;
