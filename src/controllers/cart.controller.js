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
    const product = await Product.findById(productId)
    if (quantity < 1) {
        throw new ApiError(400, "Quantity must be at least 1");
    }
    if (quantity > 15) {
        throw new ApiError(400, "Maximum quantity is 15", "Max_Quantity")

    }
    if (product.stock < quantity) {

        throw new ApiError(404, "Stock is low! ", "LOW_STOCK")
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity }],
        })
    } else {
        const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());


        if (existingItem) {
            const totalProducts = existingItem.quantity + quantity;
            if (totalProducts > 15) {
                throw new ApiError(404, "Maximum quantity is 15", "Max_Quantity")

            }
            if (product.stock < totalProducts) {

                throw new ApiError(404, "Stock is low! ", "LOW_STOCK")
            } else {
                existingItem.quantity = totalProducts;
            }

        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }
    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
        success: true,
        cart: updatedCart,
        message: "Product added and updaated in cart successfully",
    });
});

const decreaseCartQuantity = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
        throw new ApiError(400, "Product ID is required.")
    }
    if (quantity < 1) {
        throw new ApiError(400, "Quantity must be at least 1");
    }
    if (quantity > 14) {
        throw new ApiError(400, "Maximum quantity is 14", "Max_Quantity")

    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {

        throw new ApiError(404, "Cart not found.")
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found.");
    }
    const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());

    if (!existingItem) {
        throw new ApiError(404, "Item not found in the cart.");
    }
    const newQuantity = existingItem.quantity - quantity;


    existingItem.quantity = newQuantity < 1 ? 1 : newQuantity;


    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
        success: true,
        cart: updatedCart,
        message: "Product quantity decreased successfully.",
    });
});



const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { cartItemId } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found!");

    }

    cart.items = cart.items.filter((item) => item._id.toString() !== cartItemId.toString())
    await cart.save();
    res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart,
    });
})
const fetchCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        throw new ApiError(404, "Cart not found!");

    }
    return res.status(200).json(
        new ApiResponse(200, cart, "Cart fetched successfully")
    );

})
export {
    addToCart,
    decreaseCartQuantity,
    removeFromCart,
    fetchCart
}