import mongoose, { Schema } from 'mongoose';

const vehicleSchema = new Schema({
  vin: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  mileage: { type: Number, required: true },
  location: { type: String },
  imageUrl: { type: String },
  cargurus: { type: String },
});

// Use the existing model if it has already been compiled to avoid overwriting
const Vehicles = mongoose.models.Vehicles || mongoose.model('Vehicles', vehicleSchema);

export default Vehicles;