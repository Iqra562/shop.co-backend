import { asyncHandler } from "../utils/asyncHandler.js";
import { Wishlist } from "../models/wishlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [productId],
    });
  } else {
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
  }

  return res.status(200).json(
    new ApiResponse(200, wishlist, "Product added to wishlist successfully")
  );
});

const removeFromWishlist = asyncHandler(async (req,res)=>{
      const userId = req.user._id;
      const {productId} = req.params;
      if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  let wishlist = await Wishlist.findOne({user:userId});
  
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }
   wishlist.products =   wishlist.products.filter((product_id) => product_id.toString() !== productId.toString() );
   await wishlist.save();
   return res.status(200).json(
    new ApiResponse(200, wishlist, "Product removed from wishlist successfully")
  );
})

const getWishlist = asyncHandler(async (req,res)=>{
      const userId= req.user._id;
      const wishlist = await Wishlist.findOne({user:userId})
      .populate("products")
      if(!wishlist){
  throw new ApiError(404, "Wishlist not found");
      }

      return res.status(200).json(
    new ApiResponse(200, wishlist, "Wishlist fetched successfully")
  );
})

export {
    addToWishlist,
    removeFromWishlist,
    getWishlist
}