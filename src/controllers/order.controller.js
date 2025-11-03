import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Product} from "../models/product.model.js" 
const createOrder = asyncHandler(async(req,res)=>{
  const userId= req.user._id;
  const {itemDetails,shippingAddress} = req.body;
   if (!itemDetails || itemDetails.length === 0) {
    return res.status(400).json({ success:
         false, message: "No items in order" });
  }
    const orderItems = itemDetails.map(item => ({
    productId: item.product._id,
    productName:item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    thumbnail:item.product.thumbnail.url,
    total: item.product.price * item.quantity,
  }));

  const totalAmount = orderItems.reduce((acc, item) => acc + item.total, 0);

  const createOrder = await Order.create({
    user:userId,
    items:orderItems,
    // shippingAddress:shippingAddress,
    totalAmount 
  })
  return res.status(201).json(
            new ApiResponse(200, createOrder, "Order created successfully  ")
      )
 
})
const getOrder = asyncHandler(async(req,res)=>{
const userId = req.user._id;
const orders = await Order.find({ user: userId});;
 if(!orders){
  throw new ApiError(404, "Wishlist not found");
      }

      return res.status(200).json(
    new ApiResponse(200, orders, "orders fetched successfully")
  );

})
const getOrderById = asyncHandler(async(req,res)=>{
  const  userId  = req.user._id;
const orders = await Order.find({ user: userId});
 if(!orders){
  throw new ApiError(404, "orders not found");
      }

      return res.status(200).json(
    new ApiResponse(200, orders, "Order fetched successfully")
  );

})

const updatePaymentMethod = asyncHandler(async(req,res)=>{
   const {paymentMethod} = req.body;
    const { orderId } = req.params;
   if(!orderId,paymentMethod){
       throw new ApiError(400, "Order ID and payment method are required");
   }
  const order = await Order.findOne({ _id: orderId, user: req.user._id });
   if(!order){
   throw new ApiError(404, "order not found");
      }
     order.paymentMethod = paymentMethod;
  await order.save();
       return res
                  .status(200)
                  .json(
                        new ApiResponse(200, updateorder, "Payment method updated!")
                  )

})

const updatePaymentStatus = asyncHandler(async(req,res)=>{
    const {orderId} = req.params;
    const {paymentStatus} = req.body;
    const order = await Order.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if(paymentStatus === "paid"){
    await Promise.all(
      order.items.map(async(item)=>{
        if(item.status !== "cancelled"){
          
          const product = await Product.findById(item.productId);
          if(product){
            product.stock -= item.quantity;
            await product.save();
       }
       item.status = "paid";
      }
      }) 
    )
     order.paymentStatus = paymentStatus; 
    await  order.save();
    }else if(paymentStatus === "failed"){
     order.items.map((item)=>{
    item.status = "failed";
  })
  order.paymentStatus = paymentStatus
  await order.save();
    }


    return res.status(200).json(
    new ApiResponse(200, order, "Order updated successfully")
  );

})
const updateOrderStatus = asyncHandler(async(req,res)=>{
      const {orderId} =   req.params;
      const {orderStatus} = req.body;
      const order = await Order.findById(orderId);
       if (!order) throw new ApiError(404, "Order not found");
       
  order.orderStatus = orderStatus;
  await order.save();

  res.status(200).json(
    new ApiResponse(200, order, "Order status updated successfully")
  );
})

export {
    getOrder,createOrder,getOrderById, updatePaymentMethod,updatePaymentStatus,updateOrderStatus
}