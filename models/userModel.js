import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true      //white space remove
    },
    email: {
        type: String,
        required: true,
        unique: true      //must be unique
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0
    },
}, { timestamps: true }
);                          //when shows timw and date when new user is created 

export default mongoose.model("ecommernce project main", userSchema)   // (ecommernce project main) is the collecton name in the database MERNproj 