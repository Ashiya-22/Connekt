import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      index: { expires: 3600 }, // Automatically delete after 1 hour (3600 seconds)
    },
  },
  { timestamps: true }
);

// Middleware to set expiration only when status is 'accepted' or 'rejected'
connectionRequestSchema.pre('save', function (next) {
  if (this.status === 'accepted' || this.status === 'rejected') {
    this.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  }
  next();
});

const ConnectionRequest = mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema
);

export default ConnectionRequest;
