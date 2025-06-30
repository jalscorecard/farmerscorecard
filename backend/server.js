import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import pg from "pg";
import multer from "multer";
import nodemailer from "nodemailer";

const app = express();
const upload = multer();
const port = process.env.PORT || 5000;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.post("/api/submit", async (req, res) => {
  if (!req.body.fullName || !req.body.email) {
    return res.status(400).json({ success: false, message: "Full name and email are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const toNumber = (val) => {
      if (val === null || val === undefined || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

const query = `
  INSERT INTO farmer_submissions (
    fullName, email, whatsapp, date, farmName, mapLink, plotsCount,
    q1_1, q1_2, q1_3, q2_1, q2_2, q3_1, q3_2, q4_1, q4_2, q5_1, q5_2
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
  RETURNING id
`;


const values = [
  req.body.fullName,
  req.body.email,
  req.body.whatsapp || null,
  req.body.date || new Date().toISOString(),
  req.body.farmName || null,
  req.body.mapLink || null,
  toNumber(req.body.plotsCount),
  toNumber(req.body.q1_1),
  toNumber(req.body.q1_2),
  toNumber(req.body.q1_3),
  toNumber(req.body.q2_1),
  toNumber(req.body.q2_2),
  toNumber(req.body.q3_1),
  toNumber(req.body.q3_2),
  toNumber(req.body.q4_1),
  toNumber(req.body.q4_2),
  toNumber(req.body.q5_1),
  toNumber(req.body.q5_2)
];


    const result = await client.query(query, values);
    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Submission successful",
      submissionId: result.rows[0].id
    });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({
      success: false,
      message: "Failed to save submission",
      error: error.message
    });
  } finally {
    client.release();
  }
});

app.post("/api/send-pdf-email", upload.single("pdf"), async (req, res) => {
  try {
    const { email } = req.body;
    const pdf = req.file;

    if (!email || !pdf) {
      return res.status(400).json({
        success: false,
        message: "Email and PDF file are required"
      });
    }

    await transporter.sendMail({
      from: `"Farm Assessment" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Farm Assessment Report",
      text: "Hi,\n\nCongratulations on taking the first step in becoming a Profitable & Productive Farmer whose practices lead to a rich soil and abundant water.\n\nPlease find your report attached which tells you where your practices are right and where there is scope for change.\n\nContact your local Sanchaalak to learn how to make those changes to become a Profitable & Productive Farmer.\n\nRegards,\nTeam Jal Smruti",
      attachments: [{
        filename: "Farm_Assessment_Report.pdf",
        content: pdf.buffer
      }]
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
