import { submitContact } from './contact.service.js';

export const submit = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  const contact = await submitContact({ name, email, subject, message });

  res.status(201).json({ success: true, data: contact });
};
