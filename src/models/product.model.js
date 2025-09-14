import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }  
);
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, 
    description: { type: String, required: true },

    price: { type: Number, required: true },
    discountPrice: {
      type: Number,
      default: null, 
      validate: {
        validator: function (v) { 
          return v == null || v <= this.price;
        },
        message: "Discount price must be less than or equal to price",
      },
    },

    stock: { type: Number, required: true, default: 0 }, 
   thumbnail: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },

   galleryImages: [
    {
      url: { type: String },
      public_id: { type: String }
    }
  ],

    ratings: [ratingSchema],


  },
  { timestamps: true }
);

export const Product =  mongoose.model("Product", productSchema);
