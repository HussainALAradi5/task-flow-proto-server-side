import mongoose from 'mongoose';
import { config } from './environment';

export const connectDatabase = async (): Promise<void> => {
  try {
    if (!config.mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Server will start without database. API calls will fail until DB is connected.');
  }
};