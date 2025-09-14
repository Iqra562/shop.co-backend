import { Router } from "express";
import { addProduct, deleteProduct, getProduct, getProductById, removeGalleryImage, updateProduct } from "../controllers/product.controller.js";
import { authorizeRoles, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/get-product').get(getProduct);

router.route('/get-product-by-id/:id').get(getProductById);

router.route('/add-product').post(verifyJWT, authorizeRoles("admin"), upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "galleryImages", maxCount: 4 }
]), addProduct)


router.route('/update-product/:id').put(verifyJWT, authorizeRoles("admin"), upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "galleryImages", maxCount: 4 }
]), updateProduct)

router.route('/update-product/:id/remove-img/:publicId').put(verifyJWT, authorizeRoles("admin"), removeGalleryImage)
router.route('/delete-product/:id').delete(verifyJWT, authorizeRoles("admin"), deleteProduct)



export default router;
