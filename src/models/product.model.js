import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    discountPrice: { type: Number }, // optional discounted price

    stock: { type: Number, required: true, default: 0 }, 

    images: [{ type: String }], 
    thumbnail: { type: String }, 



    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],


  },
  { timestamps: true }
);

export const Product =  mongoose.model("Product", productSchema);
