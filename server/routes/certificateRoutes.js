const express = require("express");
const PDFDocument = require("pdfkit");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { name, quizName, obtainedMarks, maxMarks } = req.body;

    if (!name || !quizName || obtainedMarks == null || maxMarks == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create new PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Headers for download
    res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    // ===== Certificate Border =====
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(4)
       .stroke("#2E86C1"); // Blue border

    // ===== Title =====
    doc.fontSize(30).fillColor("#2E86C1").text("Certificate of Achievement", {
      align: "center",
    });
    doc.moveDown(2);

    // ===== Appreciation Text =====
    doc.fontSize(16).fillColor("black").text("This certificate is proudly presented to:", {
      align: "center",
    });
    doc.moveDown(1);

    // ===== Student Name =====
    doc.fontSize(28).fillColor("#1B4F72").text(name, {
      align: "center",
      underline: true,
    });
    doc.moveDown(1.5);

    // ===== Achievement Lines =====
    doc.fontSize(16).fillColor("black").text(
      `For successfully completing the "${quizName}" Quiz.`,
      { align: "center" }
    );
    doc.moveDown(0.5);

    doc.fontSize(16).text(
      `You demonstrated hard work, focus, and dedication by scoring`,
      { align: "center" }
    );
    doc.moveDown(0.3);

    doc.fontSize(18).fillColor("#117A65").text(
      `${obtainedMarks} out of ${maxMarks} marks`,
      { align: "center", bold: true }
    );
    doc.moveDown(1);

    doc.fontSize(14).fillColor("black").text(
      `"Your achievement is a reflection of your consistent effort and determination."`,
      { align: "center", italic: true }
    );
    doc.moveDown(2);

    // ===== Signature + Date =====
    const issuedDate = new Date().toLocaleDateString();
    doc.fontSize(14).fillColor("black").text(`Date: ${issuedDate}`, {
      align: "left",
    });
    doc.fontSize(14).text("Authorized Signature: ____________________", {
      align: "right",
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating certificate" });
  }
});

module.exports = router;
