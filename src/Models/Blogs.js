import mongoose from "./index.js";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "title is required"] },
    category: {
      type: String,
      enum: ["Career", "Finance", "Travel", "Technology", "Health", "Other"],
      required: [true, "category is required"],
    },
    author: { type: String, required: [true, "author is required"] },
    content: {
      type: String,
      required: [true, "content is required"],
    },
    image: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Blogs",
    versionKey: false,
  }
);

const BlogModel = mongoose.model("Blog", BlogSchema);

export default BlogModel;
