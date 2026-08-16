import { Conversation, Message } from './chat.model.js';

export const getOrCreateConversation = async (userId) => {
  let convo = await Conversation.findOne({ user: userId }).lean();
  if (!convo) {
    convo = await Conversation.create({ user: userId });
    convo = convo.toObject();
  }
  return convo;
};

export const getConversationsForAdmin = async () => {
  return Conversation.find()
    .populate('user', 'name email')
    .sort({ lastMessageAt: -1 })
    .lean();
};

export const getMessages = async (conversationId, userId, role) => {
  const convo = await Conversation.findById(conversationId).lean();
  if (!convo) return null;

  if (role === 'user' && String(convo.user) !== String(userId)) {
    return null;
  }

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .lean();

  return messages;
};

export const sendMessage = async ({ conversationId, sender, senderId, text }) => {
  const message = await Message.create({
    conversation: conversationId,
    sender,
    senderId,
    text,
  });

  const update = {
    lastMessage: text,
    lastMessageAt: new Date(),
  };

  if (sender === 'admin') {
    update.$inc = { unreadByUser: 1 };
  } else {
    update.$inc = { unreadByAdmin: 1 };
  }

  await Conversation.findByIdAndUpdate(conversationId, update);

  return message.toObject();
};

export const markAsRead = async (conversationId, role) => {
  const filter = { conversation: conversationId, read: false };
  if (role === 'admin') {
    filter.sender = 'user';
  } else {
    filter.sender = 'admin';
  }

  await Message.updateMany(filter, { read: true });

  const update = {};
  if (role === 'admin') {
    update.unreadByAdmin = 0;
  } else {
    update.unreadByUser = 0;
  }
  await Conversation.findByIdAndUpdate(conversationId, update);
};

export const getUnreadCount = async (conversationId, role) => {
  const convo = await Conversation.findById(conversationId).lean();
  if (!convo) return 0;
  return role === 'admin' ? convo.unreadByAdmin : convo.unreadByUser;
};
