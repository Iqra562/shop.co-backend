import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;
    const quantity = req.body?.quantity || 1;
    if (!productId) {
        throw new ApiError(404, "Product ID is required.")
    }
    if (quantity < 1) {
        throw new ApiError(400, "Quantity must be at least 1");
    }
    const product = await Product.findById(productId)
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity }],
        })
    } else {
        const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());


        if (existingItem) {  
            if(quantity >15)
                {
                                    throw new ApiError(404,"Maximum quantity is 15","Max_Quantity")

            }
            if(product.stock >= quantity){

                existingItem.quantity = quantity;
            }else{
                throw new ApiError(404,"Stock is low! ","LOW_STOCK")
            }

        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }
  const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
        success: true,
        cart:updatedCart,
        message: "Product added and updaated in cart successfully",
    });
})
    const removeFromCart = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
        const { cartItemId } = req.body;
        const cart= await Cart.findOne({user:userId});
        if(!cart){
            throw new ApiError(404,"Cart not found!");

        }

    cart.items = cart.items.filter((item)=>item._id.toString() !== cartItemId.toString())
                await cart.save();
    res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart,
    });
    })
const fetchCart = asyncHandler(async(req,res)=>{
   const  userId = req.user._id;
   const cart = await Cart.findOne( { user: userId }).populate("items.product");
   if(!cart){
    throw new ApiError(404,"Cart not found!");
     
   }
    return res.status(200).json(
    new ApiResponse(200, cart, "Cart fetched successfully")
  );

}) 
export {
    addToCart,
    removeFromCart,
    fetchCart
}