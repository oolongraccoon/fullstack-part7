const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const loginRouter = require("./controllers/login");
const commentsRouter = require("./controllers/comments");

const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs/:id/comments", commentsRouter);
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "test") {
  console.log("joao");
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
module.exports = app;
