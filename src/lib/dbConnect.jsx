// // lib/dbConnect.jsx
// import mongoose from 'mongoose';

// let isConnected = false; // Track the connection status

// export async function connectToDatabase() {
//   if (isConnected) return;

//   const uri = process.env.MONGO_URI;
//   if (!uri) {
//     throw new Error("Please define the MONGO_URI environment variable in your .env or .env.local file");
//   }

//   try {
//     await mongoose.connect(uri); // Cleaned: no deprecated options
//     isConnected = true;
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     throw err;
//   }
// }


// lib/dbConnect.js
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error('Please define the MONGO_URI');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
