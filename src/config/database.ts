import mongoose from 'mongoose';
import { config } from './environment';

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }

    console.log('Connecting to MongoDB...');
    console.log('URI starts with:', config.mongoUri.substring(0, 30) + '...');

    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};