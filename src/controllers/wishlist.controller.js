import { asyncHandler } from "../utils/asyncHandler.js";
import { Wishlist } from "../models/wishlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
 

  const wishlist = await Wishlist.findOneAndUpdate(
    {user:userId},
    {$addToSet:{products:productId}},
    {new:true, upsert:true}
  )

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

  const  wishlist = await Wishlist.findOneAndUpdate({user:userId},
    {
      $pull:{products:productId }
    },
    {
      new:true
    }

  );
  
  
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
    getWishlist,
 }