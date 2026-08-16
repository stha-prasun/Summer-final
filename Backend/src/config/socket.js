import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Conversation } from '../modules/chat/chat.model.js';
import { sendMessage, markAsRead } from '../modules/chat/chat.service.js';

const ROOM_USER = (userId) => `user:${userId}`;
const ROOM_ADMINS = 'admins';
const ROOM_CONVERSATION = (convoId) => `conversation:${convoId}`;

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required.'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decoded.adminID) {
        socket.role = 'admin';
        socket.identityId = decoded.adminID;
      } else if (decoded.userID) {
        socket.role = 'user';
        socket.identityId = decoded.userID;
      } else {
        return next(new Error('Invalid token.'));
      }
      next();
    } catch {
      next(new Error('Invalid or expired token.'));
    }
  });

  io.on('connection', (socket) => {
    if (socket.role === 'admin') {
      socket.join(ROOM_ADMINS);
    } else {
      socket.join(ROOM_USER(socket.identityId));
    }

    socket.on('joinConversation', (conversationId) => {
      if (!conversationId) return;
      socket.join(ROOM_CONVERSATION(conversationId));
    });

    socket.on('leaveConversation', (conversationId) => {
      if (!conversationId) return;
      socket.leave(ROOM_CONVERSATION(conversationId));
    });

    socket.on('sendMessage', async ({ conversationId, text }, ack) => {
      try {
        if (!conversationId || !text?.trim()) {
          ack?.({ success: false, message: 'Conversation ID and text are required.' });
          return;
        }

        if (socket.role === 'user') {
          const convo = await Conversation.findById(conversationId).select('user').lean();
          if (!convo || String(convo.user) !== String(socket.identityId)) {
            ack?.({ success: false, message: 'Conversation not found.' });
            return;
          }
        }

        const message = await sendMessage({
          conversationId,
          sender: socket.role,
          senderId: socket.identityId,
          text: text.trim(),
        });

        const room = ROOM_CONVERSATION(conversationId);
        io.to(room).emit('message:new', { conversationId, message });
        io.to(ROOM_ADMINS).emit('chat:update', { conversationId });

        ack?.({ success: true, message });
      } catch (error) {
        console.error('Socket sendMessage error:', error);
        ack?.({ success: false, message: error.message || 'Failed to send message.' });
      }
    });

    socket.on('markRead', async ({ conversationId }) => {
      try {
        if (!conversationId) return;
        await markAsRead(conversationId, socket.role);
        io.to(ROOM_ADMINS).emit('chat:update', { conversationId });
      } catch (error) {
        console.error('Socket markRead error:', error);
      }
    });

    socket.on('disconnect', () => {
      // rooms are cleaned up automatically
    });
  });

  return io;
};