import { Contact } from '../contact.model.js';

export const createContact = (data) => {
  const { name, email, subject, message } = data;

  if (!name || !email || !message) {
    throw new Error('Name, email, and message are required.');
  }

  return new Contact({
    name,
    email,
    subject: subject || '',
    message,
  });
};
