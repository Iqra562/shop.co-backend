import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addToCart, fetchCart, removeFromCart, decreaseCartQuantity } from "../controllers/cart.controller.js";
const router = Router();
router.route('/add-to-cart').post(verifyJWT,addToCart);
router.route('/decrease-cart-quantity').patch(verifyJWT,decreaseCartQuantity);
router.route('/remove-from-cart').post(verifyJWT,removeFromCart)
router.route('/fetch-cart').get(verifyJWT,fetchCart);
export default router;