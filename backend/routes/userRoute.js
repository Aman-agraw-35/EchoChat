import express from "express";
import { getOtherUsers, login, logout, register } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { upload, errorHandler } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.route("/register").post(upload.single('profileImage'), errorHandler, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticated,getOtherUsers);

export default router;