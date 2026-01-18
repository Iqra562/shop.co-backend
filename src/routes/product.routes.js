import { Router } from "express";
import { addProduct, deleteProduct, getProduct, getProductById, removeGalleryImage, updateProduct } from "../controllers/product.controller.js";
import { authorizeRoles, requireVerifiedUser, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js";
import { addToCart, fetchCart, removeFromCart } from "../controllers/cart.controller.js";
import { createOrder, getOrder, getOrderById, updatePaymentMethod } from "../controllers/order.controller.js";

const router = Router();

router.route('/get-product').get(getProduct);

router.route('/get-product-by-id/:id').get(getProductById);

router.route('/add-product').post(verifyJWT,requireVerifiedUser, authorizeRoles("admin"), upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "galleryImages", maxCount: 4 }
]), addProduct)


router.route('/update-product/:id').put(verifyJWT,requireVerifiedUser, authorizeRoles("admin"), upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "galleryImages", maxCount: 4 }
]), updateProduct)

router.route('/update-product/:id/remove-img/:publicId').put(verifyJWT,requireVerifiedUser, authorizeRoles("admin"), removeGalleryImage)
router.route('/delete-product/:id').delete(verifyJWT,requireVerifiedUser, authorizeRoles("admin"), deleteProduct)



export default router;
