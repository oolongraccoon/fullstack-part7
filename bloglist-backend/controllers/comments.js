const commentsRouter = require("express").Router({ mergeParams: true });
const Comment = require("../models/comment");
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

commentsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const body = request.body;
      const blog = await Blog.findById(request.params.id);
      console.log("joao")
      if (!blog) {
        return response.status(404).json({ error: "blog not found" });
      }
      if(!body.content){
        return response.status(400).json({ error: "content is required" });
      }
      const comment = new Comment({
        content: body.content,
        blog: blog._id,
      });

      const savedComment = await comment.save();
      blog.comments = blog.comments.concat(savedComment._id);
      await blog.save();

      response.status(201).json(savedComment);
    } catch (exception) {
      next(exception);
    }
  },
);
commentsRouter.get(
  "/", async (request, response) => {
    const comments = await Comment.find({blog:request.params.id})
  response.json(comments);
});

module.exports = commentsRouter;
