const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        price: { type: Number }, 
      },
    ],
    shippingAddress: addressSchema,
    paymentMethod: { type: String, enum: ["cod", "card", "paypal"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"], default: "processing" },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);
export const Order = mongoose.model("Order",orderSchema)