import { useState } from "react";

const CreateComment = ({ createComment,blog }) => {
  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const blogId = blog.id
 
    createComment({newComment,blogId});

    setNewComment("");
  };

  return (
    <form onSubmit={handleSubmit} data-testid="create">
      <div>
        <input type="text" value={newComment} onChange={handleCommentChange} />
      </div>
      <div>
        <button type="submit" data-testid="add-comment">
          add comment
        </button>
      </div>
    </form>
  );
};

export default CreateComment;
