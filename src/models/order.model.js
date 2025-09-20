import mongoose ,{Schema} from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  price: Number,
  quantity: Number,
  total:Number,
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" }
});
const addressSchema = new mongoose.Schema({
    fullName: String,
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
}, { _id: false }   );

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
     items: [orderItemSchema],
    shippingAddress: addressSchema,
    paymentMethod: { type: String, enum: ["cod", "card", "paypal"] },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: { type: String, enum: ["pending","processing", "shipped", "delivered", "cancelled"], default: "pending" },
      // shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order",orderSchema)










