import mongoose from "mongoose";
import BlogModel from "../Models/Blogs.js";

const createBlog = async (req, res) => {
  try {
    const { title, category, content, image } = req.body;
    const userId = req.user.id;

    const newBlog = await BlogModel.create({
      title,
      category,
      content,
      image,
      userId,
      author: userId,
    });

    res
      .status(201)
      .send({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res
      .status(500)
      .send({ message: "Failed to create blog", error: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const { category, author } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (author) filter.author = author;

    const blogs = await BlogModel.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("author", "name email");

    res.status(200).send({ blogs });

    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found." });
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res
      .status(500)
      .send({ message: "Failed to fetch blogs", error: error.message });
  }
};

const getBlogsByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const blogs = await BlogModel.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "name email");

    res.status(200).send({ blogs });
  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    res.status(500).send({
      message: "Failed to fetch your blogs",
      error: error.message,
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send({ message: "Invalid blog ID" });
    }

    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    if (blog.userId.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this blog" });
    }

    if (updateData.length === 0) {
      return res.status(400).send({ message: "No fields to update" });
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(blogId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({ message: "Blog updated", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .send({ message: "Failed to update blog", error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send({ message: "Invalid blog ID" });
    }

    const blog = await BlogModel.findById(blogId);

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    if (blog.userId.toString() !== userId) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this blog" });
    }

    await BlogModel.findByIdAndDelete(blogId);

    res.status(200).send({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res
      .status(500)
      .send({ message: "Failed to delete blog", error: error.message });
  }
};

export default {
  createBlog,
  getBlogs,
  getBlogsByUser,
  updateBlog,
  deleteBlog,
};
