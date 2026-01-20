import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vocational');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Only exit in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.warn('⚠️ MongoDB connection failed. Running in development mode without database.');
  }
};

export default connectDB;
