import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URI) return console.error('MongoDB URL not found.');
  if (isConnected) return console.info('Already connected to the DB.');

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    console.info('Connected to the DB!');
  } catch (error) {
    console.error(error);
  }
};
