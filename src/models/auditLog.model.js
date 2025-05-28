import mongoose from 'mongoose';

// Audit Log Schema for tracking user actions in the application
const auditLogSchema = new mongoose.Schema({
  action: String, // e.g., "Left Group", "Request Sent", "Removed Member"
  reason: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  affectedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
