import mongoose from "mongoose";


const connectDB= async () => {
    const MONGO_URI = process.env.MONGO_URI;
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error('Error connecting to MongoDB: ', error.message);
        process.exit(1);
    }
};

export default connectDB;