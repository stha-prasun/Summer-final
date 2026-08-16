import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./contact.service.js', () => ({
  submitContact: vi.fn(),
}));

import { submit } from './contact.controller.js';
import { submitContact } from './contact.service.js';
import { makeRes } from '../../test/helpers.js';

describe('contact.controller submit', () => {
  beforeEach(() => {
    submitContact.mockReset();
  });

  it('responds 201 with the saved contact on success', async () => {
    const contact = { _id: 'c1', name: 'Alice', email: 'a@b.com', message: 'Hi' };
    submitContact.mockResolvedValue(contact);
    const req = { body: { name: 'Alice', email: 'a@b.com', subject: 'Question', message: 'Hi' } };
    const res = makeRes();

    await submit(req, res);

    expect(submitContact).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'a@b.com',
      subject: 'Question',
      message: 'Hi',
    });
    expect(res._status).toBe(201);
    expect(res._body).toEqual({ success: true, data: contact });
  });

  it('responds 400 when required fields are missing', async () => {
    const res = makeRes();

    await submit({ body: { name: 'Alice' } }, res);

    expect(submitContact).not.toHaveBeenCalled();
    expect(res._status).toBe(400);
    expect(res._body).toEqual({ success: false, error: 'Name, email, and message are required.' });
  });
});
