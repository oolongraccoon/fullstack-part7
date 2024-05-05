const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments");
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const blogData = request.body;
  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: "user is missing" });
  }
  console.log(JSON.stringify(user));
  if (typeof blogData.likes === "undefined") {
    blogData.likes = 0;
  }
  const blog = new Blog({
    url: blogData.url,
    title: blogData.title,
    author: blogData.author,
    likes: blogData.likes,
    user: user._id,
  });
  logger.info(user._id);
  try {
    if (!blogData.title || !blogData.url) {
      return response.status(400).json({ error: "Title or URL is missing" });
    }

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});
blogsRouter.get("/:id", async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }
    response.json(blog);
  } catch (exception) {
    next(exception);
  }
});
// 4.21*: bloglist expansion, step9
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const user = request.user;

    if (!user) {
      return response.status(400).json({ error: "user is missing" });
    }
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: "permission denied" });
    }
    try {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } catch (exception) {
      next(exception);
    }
  },
);

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog);
    })
    .catch((error) => next(error));
});
module.exports = blogsRouter;
