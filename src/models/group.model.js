import mongoose from 'mongoose';

// Group Schema for managing groups within the application;

const groupSchema = new mongoose.Schema({
  group_name: { type: String, required: true },
  description: String,
  talent_hunt: String,
  leaderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isDeleted: { type: Boolean, default: false },
  noticeBoard: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notice' }],
  auditLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AuditLog' }]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
