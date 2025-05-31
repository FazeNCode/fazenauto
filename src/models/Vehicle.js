import mongoose, { Schema } from 'mongoose';

const vehicleSchema = new Schema(
  {
    vin: { type: String, required: true, unique: true },
    imageHash: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    location: { type: String },
    imageUrl: { type: String }, // S3 image URL
    cargurus: { type: String },
    engine: { type: String, required: true, unique: true },          
    drivetrain: { type: String, required: true, unique: true },       
    transmission: { type: String, required: true, unique: true },     
  },
  {
    timestamps: true, // ⏱️ Automatically adds createdAt and updatedAt
  }
);

// Prevent model overwrite issues in dev/hot reload
export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
