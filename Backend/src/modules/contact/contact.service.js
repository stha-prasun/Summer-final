import { Contact } from './contact.model.js';
import { resend } from '../../config/resend.js';
import logger from '../../config/logger.js';

export const submitContact = async ({ name, email, subject, message }) => {
  const contact = await Contact.create({ name, email, subject, message });

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [process.env.RESEND_TO_EMAIL],
      subject: `Contact Form: ${subject || 'No Subject'}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#ef4444;border-bottom:2px solid #ef4444;padding-bottom:8px">New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px 0;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Name</td></tr>
            <tr><td style="padding:0 0 12px;font-size:15px">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Email</td></tr>
            <tr><td style="padding:0 0 12px;font-size:15px">${email}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Subject</td></tr>
            <tr><td style="padding:0 0 12px;font-size:15px">${subject || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.1em">Message</td></tr>
            <tr><td style="padding:12px;background:#f4f4f5;border-radius:4px;font-size:14px;line-height:1.6;white-space:pre-wrap">${message}</td></tr>
          </table>
          <p style="color:#a1a1aa;font-size:11px;border-top:1px solid #e4e4e7;padding-top:12px">Sent via WheelsRUs Contact Form</p>
        </div>
      `,
    });
  } catch (err) {
    logger.warn('Failed to send contact email', { error: err.message });
  }

  return contact;
};
