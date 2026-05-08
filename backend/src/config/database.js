import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URI;

        if (!mongoUrl) {
            throw new Error('MongoDB connection string is missing. Set MONGODB_URL in backend/.env');
        }

        const conn = await mongoose.connect(mongoUrl);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
