import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: { type: String, enum: ['user', 'admin'], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    unreadByAdmin: { type: Number, default: 0 },
    unreadByUser: { type: Number, default: 0 },
  },
  { timestamps: true }
);

conversationSchema.index({ user: 1 }, { unique: true });
conversationSchema.index({ lastMessageAt: -1 });

export const Conversation = mongoose.model('Conversation', conversationSchema);
export const Message = mongoose.model('Message', messageSchema);
