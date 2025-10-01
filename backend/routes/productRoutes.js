// routes/productEnquiry.js
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      message,
      color,
      quantity,
      product,
      productId
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const subject = `🧸 New Product Enquiry: ${product}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height:1.6; max-width:600px; margin:auto; border:1px solid #eee; border-radius:8px; overflow:hidden;">
        <div style="background:#f78da7; color:#fff; padding:16px; text-align:center;">
          <h2 style="margin:0;">New Product Enquiry</h2>
        </div>
        <div style="padding:20px;">
          <h3 style="margin-top:0; color:#444;">Product Details</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Product</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${product}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Product ID</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${productId}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Quantity</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${quantity}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Color</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${color || "Not specified"}</td></tr>
          </table>

          <h3 style="margin-top:24px; color:#444;">Customer Details</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Name</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${name}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${email}</td></tr>
            <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Phone</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${phone}</td></tr>
          </table>

          <h3 style="margin-top:24px; color:#444;">Message</h3>
          <p style="background:#f9f9f9; padding:12px; border-radius:6px; white-space:pre-line;">
            ${message || "No message provided."}
          </p>
        </div>
        <div style="background:#f1f1f1; padding:12px; text-align:center; font-size:12px; color:#777;">
          This enquiry was sent via your website product enquiry form.
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Product Enquiry" <${process.env.MAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject,
      text: `
New Product Enquiry

Product: ${product} (ID: ${productId})
Quantity: ${quantity}
Color: ${color || "Not specified"}

Customer:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Message:
${message || "(no message)"}
      `,
      html: htmlBody
    };

    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to send product enquiry email", err);
    res.status(500).json({ error: "mail_failed" });
  }
});

export default router;
