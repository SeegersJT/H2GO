import mongoose from 'mongoose';
import dotenv from 'dotenv';
import log from '../utils/Logger.util';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(`Environment variable MONGO_URI is missing`);
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);

    log.tag('MONGODB', '✅').info('Connected to Database')
  } catch (error) {
    log.tag('MONGODB', '').error(`Database connection error: ${error}`)
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    log.tag('MONGODB', '⚠️').warn('Database disconnected!')
  });

  mongoose.connection.on('reconnected', () => {
    log.tag('MONGODB', '✅').info('Database reconnected')
  });
};
