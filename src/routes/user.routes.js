import { Router } from "express";
import { registerUser ,loginUser,logoutUser,refreshAccessToken, checkAuth} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js" ;
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(registerUser)
router.route("/login").post(loginUser)
router.route('/logout').post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/auth/check").get(verifyJWT,checkAuth)
export default router;  