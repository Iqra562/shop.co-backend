import { Router } from "express";
import { requireVerifiedUser, verifyJWT } from "../middlewares/auth.middleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = Router();
router.route('/').get(verifyJWT,requireVerifiedUser,getWishlist )
router.route('/').post(verifyJWT,requireVerifiedUser,addToWishlist )
router.route('/:productId').delete(verifyJWT,requireVerifiedUser,removeFromWishlist )
export default router;
