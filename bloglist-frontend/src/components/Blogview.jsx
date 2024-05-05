import { useState } from "react";
import { Link } from "react-router-dom";

const Blogview = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <li className="blog">
      <div style={blogStyle}>
        <div data-testid="blogView">
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} {blog.author}
          </Link>
        </div>
      </div>
    </li>
  );
};
export default Blogview;
