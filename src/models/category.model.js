import mongoose, { Schema, Document, Model } from "mongoose";


const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  level: {
    type: Number,
    required: true,
    enum: [1, 2, 3], 
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
  ancestors:[{
     type: Schema.Types.ObjectId,
    ref: "Category"
  }]
}, {
  timestamps: true,
});

export const Category = mongoose.model("Category", CategorySchema);

  