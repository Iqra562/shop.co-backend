import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";

const router = Router();
router.route('/add-to-wishlist/:productId').post(verifyJWT,addToWishlist   )
router.route('/remove-from-wishlist/:productId').post(verifyJWT,removeFromWishlist    )
router.route('/get-wishlist').get(verifyJWT,getWishlist    )
export default router