import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const { name, email, service, message } = await req.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
        }

        // Create transporter using M365 SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Format the service name nicely
        const serviceLabels: Record<string, string> = {
            nimc: 'NIMC Registration',
            school: 'School Registrations',
            internet: 'Internet Services',
            seo: 'SEO & Website Management',
            ai: 'AI Data Consulting',
            tech: 'Technical Support',
            productivity: 'AI-Enhanced Productivity',
            other: 'Other',
        };
        const serviceName = serviceLabels[service] || service || 'Not specified';

        // Send email to admin
        await transporter.sendMail({
            from: `"Triumphant HQ Website" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            replyTo: email,
            subject: `New Contact Form: ${serviceName} — ${name}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a14; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #00ff88, #00ccff); padding: 4px;"></div>
          <div style="padding: 32px;">
            <h1 style="color: #00ff88; font-size: 20px; margin: 0 0 24px 0;">New Contact Form Submission</h1>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px; width: 100px;">Name</td>
                <td style="padding: 8px 12px; color: #fff; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px;">Email</td>
                <td style="padding: 8px 12px;"><a href="mailto:${email}" style="color: #00ccff;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #888; font-size: 13px;">Service</td>
                <td style="padding: 8px 12px; color: #fff;">${serviceName}</td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #00ff88;">
              <p style="color: #888; font-size: 13px; margin: 0 0 8px 0;">Message</p>
              <p style="color: #e0e0e0; margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>

            <p style="margin-top: 32px; color: #555; font-size: 12px;">
              This message was sent from the Triumphant HQ website contact form.
            </p>
          </div>
        </div>
      `,
        });

        // Send confirmation to the person who submitted
        await transporter.sendMail({
            from: `"Triumphant HQ" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "We received your message — Triumphant HQ",
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a14; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #00ff88, #00ccff); padding: 4px;"></div>
          <div style="padding: 32px;">
            <h1 style="color: #00ff88; font-size: 22px; margin: 0 0 16px 0;">Thank you, ${name}!</h1>
            <p style="line-height: 1.7; color: #ccc;">
              We've received your message and will get back to you within <strong style="color: #fff;">24 hours</strong>.
            </p>
            <p style="line-height: 1.7; color: #ccc;">
              If your matter is urgent, feel free to reach us directly on WhatsApp.
            </p>
            <div style="margin-top: 24px;">
              <a href="https://wa.me/2348000000000" style="display: inline-block; padding: 10px 24px; background: #00ff88; color: #000; font-weight: 700; text-decoration: none; border-radius: 8px; font-size: 14px;">
                WhatsApp Us
              </a>
            </div>
            <p style="margin-top: 32px; color: #555; font-size: 12px;">
              — The Triumphant HQ Team<br>
              No 4, Kolawole Close, Ibadan, Nigeria
            </p>
          </div>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
    }
}
