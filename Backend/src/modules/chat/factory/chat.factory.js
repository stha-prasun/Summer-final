import { Conversation, Message } from '../chat.model.js';

const VALID_SENDERS = ['user', 'admin'];

export const createConversation = (userId) => {
  if (!userId) {
    throw new Error('User ID is required.');
  }

  return new Conversation({
    user: userId,
    lastMessage: '',
    unreadByAdmin: 0,
    unreadByUser: 0,
  });
};

export const createMessage = (data) => {
  const { conversation, sender, senderId, text } = data;

  if (!conversation || !sender || !senderId || !text) {
    throw new Error('Conversation, sender, senderId, and text are required.');
  }

  if (!VALID_SENDERS.includes(sender)) {
    throw new Error(`Invalid sender. Must be one of: ${VALID_SENDERS.join(', ')}`);
  }

  return new Message({
    conversation,
    sender,
    senderId,
    text,
    read: false,
  });
};
