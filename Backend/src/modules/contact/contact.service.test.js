import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSave = vi.fn();

vi.mock('./contact.model.js', () => {
  const ContactMock = vi.fn().mockImplementation(function (data) {
    return { ...data, save: mockSave };
  });
  return { Contact: ContactMock };
});

vi.mock('../../config/resend.js', () => ({
  resend: { emails: { send: vi.fn() } },
}));

vi.mock('../../config/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { Contact } from './contact.model.js';
import { resend } from '../../config/resend.js';
import logger from '../../config/logger.js';
import { submitContact } from './contact.service.js';

const input = { name: 'Alice', email: 'a@b.com', subject: 'Question', message: 'Hi there' };

describe('contact.service submitContact', () => {
  beforeEach(() => {
    Contact.mockClear();
    mockSave.mockReset();
    resend.emails.send.mockReset();
    logger.warn.mockReset();
  });

  it('creates the contact and sends the notification email', async () => {
    const saved = { _id: 'c1', ...input };
    mockSave.mockResolvedValue(saved);
    resend.emails.send.mockResolvedValue({ id: 'email-1' });

    const result = await submitContact(input);

    expect(Contact).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Alice', email: 'a@b.com', subject: 'Question', message: 'Hi there' })
    );
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Contact Form: Question' })
    );
    expect(result).toBe(saved);
  });

  it('uses a fallback subject when none is provided', async () => {
    mockSave.mockResolvedValue({ _id: 'c2' });
    resend.emails.send.mockResolvedValue({ id: 'email-2' });

    await submitContact({ ...input, subject: undefined });

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Contact Form: No Subject' })
    );
  });

  it('still returns the contact when the email send fails', async () => {
    const saved = { _id: 'c3', ...input };
    mockSave.mockResolvedValue(saved);
    resend.emails.send.mockRejectedValue(new Error('smtp down'));

    const result = await submitContact(input);

    expect(logger.warn).toHaveBeenCalled();
    expect(result).toBe(saved);
  });
});