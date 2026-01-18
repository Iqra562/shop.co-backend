import { Router } from "express";
import { requireVerifiedUser, verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart, fetchCart, removeFromCart, decreaseCartQuantity } from "../controllers/cart.controller.js";
const router = Router();
router.route('/add-to-cart').post(verifyJWT,requireVerifiedUser,addToCart);
router.route('/decrease-cart-quantity').patch(verifyJWT,requireVerifiedUser,decreaseCartQuantity);
router.route('/remove-from-cart').post(verifyJWT,requireVerifiedUser,removeFromCart)
router.route('/fetch-cart').get(verifyJWT,requireVerifiedUser,fetchCart);
export default router;