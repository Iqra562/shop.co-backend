import { Router } from "express";
import { addCategory, fetchSubCategories } from "../controllers/category.controller.js";
import { fetchParentCategories } from "../controllers/category.controller.js";
const router= Router();
router.route('/').post(addCategory)
 
router.route('/').get(fetchParentCategories);
router.route('/sub/:parentId').get(fetchSubCategories);

 export default router; 