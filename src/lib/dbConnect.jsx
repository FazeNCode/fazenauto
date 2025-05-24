import mongoose from 'mongoose';

const connection = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not found in environment variables");

  const db = await mongoose.connect(uri);
  connection.isConnected = db.connections[0].readyState;
  console.log("MongoDB connected");
}

export default dbConnect;