import mongoose from 'mongoose';

let cachedConnection = null;

export const connectDB = async () => {
    try {
        if (cachedConnection) {
            return cachedConnection;
        }

        const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URI;

        if (!mongoUrl) {
            throw new Error('MongoDB connection string is missing. Set MONGODB_URL in environment variables.');
        }

        const conn = await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        cachedConnection = conn;
        return cachedConnection;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        throw error;
    }
};
