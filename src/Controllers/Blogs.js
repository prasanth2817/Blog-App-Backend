import mongoose from "mongoose";
import BlogModel from "../Models/Blogs.js";
import UserModel from "../Models/Users.js"

const createBlog = async (req, res) => {
  try {
    const { title, category, content, image } = req.body;
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBlog = await BlogModel.create({
      title,
      category,
      content,
      image,
      userId,
      author: user.name,
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
      .populate("userId", "name email");

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
    const userId = req.user?.id;

    const blogs = await BlogModel.find({ userId }) 
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
 
    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found." });
    }

    res.status(200).json({ blogs });

  } catch (error) {
    console.error("Error fetching user's blogs:", error);
    res.status(500).json({
      message: "Failed to fetch your blogs",
      error: error.message,
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).send({ message: "Invalid blog ID" });
    }

    const blog = await BlogModel.findById(blogId).populate("userId", "name email");

    if (!blog) {
      return res.status(404).send({ message: "Blog not found" });
    }

    res.status(200).send({ blog });
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.status(500).send({ message: "Failed to fetch blog", error: error.message });
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
  getBlogById,
  updateBlog,
  deleteBlog,
};
