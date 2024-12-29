import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    gst: { type: Number, default: 18, min: 0 },
    price: { type: Number, required: true }, 
    subTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);


export default mongoose.model("Product", productSchema);
