import mongoose from "mongoose";
import dotenv from "dotenv";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`conntects to the momgodb database ${conn.connection.host}`);
    } catch (error) {
        console.log(`error in momgodb ${error}`)
    }
};

export default connectDB;