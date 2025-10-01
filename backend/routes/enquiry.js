// routes/enquiry.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { parentName, email, phone, city, childAge, interest, message } = req.body;

    // transporter config (swap Gmail out if you move to SES/SendGrid etc.)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const subject = `👶 New Toy Enquiry from ${parentName}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color:#333; max-width:600px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
        <div style="background:#6B63C8; color:#fff; padding:16px; text-align:center;">
          <h2 style="margin:0;">New Toy Enquiry</h2>
        </div>
        <div style="padding:20px;">
          <h3 style="margin-top:0; color:#444;">Parent / Guardian Details</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Name</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${parentName}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${email}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Phone</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${phone}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>City</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${city || "-"}</td></tr>
          </table>

          <h3 style="margin-top:24px; color:#444;">Child Details</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Age</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${childAge}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Interest</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${interest || "-"}</td></tr>
          </table>

          <h3 style="margin-top:24px; color:#444;">Message</h3>
          <p style="background:#f9f9f9; padding:12px; border-radius:6px; white-space:pre-line;">
            ${message || "No message provided."}
          </p>
        </div>
        <div style="background:#f1f1f1; padding:12px; text-align:center; font-size:12px; color:#777;">
          This enquiry was submitted from your website booking form.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Toy Enquiry" <${process.env.MAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject,
      text: `
Parent/Guardian: ${parentName}
Email: ${email}
Phone: ${phone}
City: ${city}
Child Age: ${childAge}
Interest: ${interest}
Message: ${message || "-"}
      `,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error("Mail send error", err);
    res.status(500).json({ error: "mail_failed" });
  }
});

export default router;
