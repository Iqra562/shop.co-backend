import { Router } from "express";
import { requireVerifiedUser, verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, getOrder, getOrderById, updateOrderStatus, updatePaymentMethod, updatePaymentStatus } from "../controllers/order.controller.js";

const router = Router();

router.route('/create-order').post(verifyJWT,requireVerifiedUser,createOrder)
router.route('/get-order').get(verifyJWT,requireVerifiedUser,getOrder)
router.route('/get-order-by-id').get(verifyJWT,requireVerifiedUser,getOrderById)
router.route('/update-payment-method').put(verifyJWT,requireVerifiedUser,updatePaymentMethod)
router.route('/update-payment-status/:orderId').put(verifyJWT,requireVerifiedUser,updatePaymentStatus)
router.route('/update-order-status/:orderId').put(verifyJWT,requireVerifiedUser,updateOrderStatus)
export default router