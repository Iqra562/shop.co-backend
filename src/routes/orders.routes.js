import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, getOrder, getOrderById, updateOrderStatus, updatePaymentMethod, updatePaymentStatus } from "../controllers/order.controller.js";

const router = Router();

router.route('/create-order').post(verifyJWT,createOrder)
router.route('/get-order').get(verifyJWT,getOrder)
router.route('/get-order-by-id/:userId').get(verifyJWT,getOrderById)
router.route('/update-payment-method').put(verifyJWT,updatePaymentMethod)
router.route('/update-payment-status/:orderId').put(verifyJWT,updatePaymentStatus)
router.route('/update-order-status/:orderId').put(verifyJWT,updateOrderStatus)
export default router