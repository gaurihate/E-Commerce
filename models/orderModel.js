import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products",
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        payment: {},
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ecommernce project main",
        },
        status: {
            type: String,
            default: "Not Process",
            enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
