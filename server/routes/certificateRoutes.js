const express = require("express");
const PDFDocument = require("pdfkit");

const router = express.Router();

router.post("/generate", (req, res) => {
  try {
    const { studentName, quizName, obtainedMarks, totalMarks } = req.body;

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${studentName}-certificate.pdf`
    );

    doc.pipe(res);

    // Border
    doc.rect(20, 20, 555, 800).stroke("#0a5275");

    doc
      .fontSize(28)
      .fillColor("#0a5275")
      .font("Times-Bold")
      .text("Certificate of Achievement", { align: "center" });

    doc.moveDown(2);

    doc
      .fontSize(16)
      .fillColor("black")
      .font("Times-Roman")
      .text("This certificate is proudly presented to", { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(24)
      .fillColor("#1a5276")
      .font("Times-BoldItalic")
      .text(studentName, { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(14)
      .fillColor("black")
      .text(`for completing the quiz "${quizName}" successfully.`, {
        align: "center",
      })
      .moveDown(0.5)
      .text(`Score: ${obtainedMarks} / ${totalMarks}`, { align: "center" })
      .moveDown(1)
      .text(
        "Your dedication and effort are commendable. Keep learning and achieving!",
        { align: "center", width: 500 }
      );

    doc.moveDown(3);

    doc
      .fontSize(12)
      .text("_________________________", 100, 600, { align: "left" })
      .text("Authorized Signature", 100, 620, { align: "left" });

    doc
      .text("_________________________", 350, 600, { align: "right" })
      .text("Coordinator", 350, 620, { align: "right" });

    doc.end();
  } catch (err) {
    console.error("❌ Certificate generation failed:", err);
    res.status(500).json({ error: "Certificate generation failed" });
  }
});

module.exports = router;
