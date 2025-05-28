import mongoose from 'mongoose';

// Join Request Schema for managing group join requests
const joinRequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'withdrawn'],
    default: 'pending'
  },
  reason: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
