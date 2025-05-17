import express from "express";
import BlogController from "../Controllers/Blogs.js";
import isLoggedIn from "../Middlewares/authToken.js";

const router = express.Router();

router.get("/", isLoggedIn, BlogController.getBlogs);
router.post("/", isLoggedIn, BlogController.createBlog);
router.put("/:id", isLoggedIn, BlogController.updateBlog);
router.delete("/:id", isLoggedIn, BlogController.deleteBlog);

export default router;
