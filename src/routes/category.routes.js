import { Router } from "express";
import { addCategory, fetchSubCategories, getProductsByCategory } from "../controllers/category.controller.js";
import { fetchParentCategories } from "../controllers/category.controller.js";
const router= Router();
router.route('/').post(addCategory)
 
router.route('/').get(fetchParentCategories);
router.route('/sub/:parentId').get(fetchSubCategories);
router.route('/get-product-by-category/:categoryId').get(getProductsByCategory);

 export default router; 