import * as chatService from './chat.service.js';

// User: get or create their conversation
export const getConversation = async (req, res) => {
  try {
    const convo = await chatService.getOrCreateConversation(req.userId);
    return res.status(200).json({ success: true, conversation: convo });
  } catch (error) {
    console.error('Get conversation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get conversation.' });
  }
};

// User/Admin: get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.adminId ? 'admin' : 'user';
    const userId = req.userId || req.adminId;

    const messages = await chatService.getMessages(id, userId, role);
    if (messages === null) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }
    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get messages.' });
  }
};

// User/Admin: send a message
export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const role = req.adminId ? 'admin' : 'user';
    const senderId = req.userId || req.adminId;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    const message = await chatService.sendMessage({
      conversationId: id,
      sender: role,
      senderId,
      text: text.trim(),
    });

    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

// User/Admin: mark messages as read
export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.adminId ? 'admin' : 'user';
    await chatService.markAsRead(id, role);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    return res.status(500).json({ success: false, message: 'Failed to mark as read.' });
  }
};

// Admin: get all conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await chatService.getConversationsForAdmin();
    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to get conversations.' });
  }
};

// User: get unread count
export const getUserUnread = async (req, res) => {
  try {
    const convo = await chatService.getOrCreateConversation(req.userId);
    const count = await chatService.getUnreadCount(convo._id, 'user');
    return res.status(200).json({ success: true, unread: count });
  } catch (error) {
    return res.status(500).json({ success: false, unread: 0 });
  }
};
