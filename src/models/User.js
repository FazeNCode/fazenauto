import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed
    role: { type: String, enum: ['admin', 'dealer'], default: 'dealer' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
