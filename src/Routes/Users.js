import express from "express";
import UserController from "../Controllers/Users.js";

const router = express.Router();

// User registration routes
router.post("/login", UserController.login);
router.post("/signup", UserController.createUser);

// Password management routes
router.post("/forget-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

export default router;
