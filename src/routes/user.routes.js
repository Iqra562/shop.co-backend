import { Router } from "express";
import { registerUser ,loginUser,logoutUser,refreshAccessToken, checkAuth, getCurrentUser, addAddress, updateAddress, deleteAddress, updateAccountDetails, verifyUser} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js" ;
import { requireVerifiedUser, verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(registerUser)
router.post("/verify-otp", verifyJWT, verifyUser);
router.route("/login").post(loginUser)
router.route('/logout').post(verifyJWT,requireVerifiedUser,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/auth/check").get(verifyJWT,requireVerifiedUser,checkAuth)
router.route("/user/data").get(verifyJWT,requireVerifiedUser,getCurrentUser)
router.route("/update-account-details").patch(verifyJWT,requireVerifiedUser, updateAccountDetails)
router.route("/address/add").post(verifyJWT,requireVerifiedUser,addAddress)
router.route("/address/update/:id").patch(verifyJWT,requireVerifiedUser,updateAddress)
router.route("/address/delete/:id").delete(verifyJWT,requireVerifiedUser,deleteAddress)
export default router;   