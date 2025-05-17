import express from "express";
import UserRoutes from "./Users.js";
import BlogsRoutes from "./Blogs.js";

const router = express.Router();

router.use("/auth", UserRoutes);
router.use("/blogs", BlogsRoutes);

export default router;
