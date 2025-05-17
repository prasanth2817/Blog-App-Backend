import express from "express";
import BlogController from "../Controllers/Blogs.js";
import Auth from "../Middlewares/authToken.js";

const router = express.Router();

router.get("/", Auth.isLoggedIn, BlogController.getBlogs);
router.post("/", Auth.isLoggedIn, BlogController.createBlogs);
router.put("/:id", Auth.isLoggedIn, BlogController.editBlogs);
router.delete("/:id", Auth.isLoggedIn, BlogController.deleteBlogs);

export default router;
