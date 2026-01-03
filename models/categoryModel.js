import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
});

export default mongoose.model("Category", categorySchema);



// server.js
//  ↓
// connectDB() → MongoDB connected
//  ↓
// Route hits controller
//  ↓
// Controller imports Category model
//  ↓
// Category.create()
//  ↓
// MongoDB creates collection
//  ↓
// Data stored
