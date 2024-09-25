import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostAndComments } from "../../../APIs/postsApis";
import "./stylee.css"

const PostDetails = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.postsData.post);
  const comments = useSelector((state) => state.postsData.comments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchPostAndComments(postId)).then(() => {
      setLoading(false);
    });
  }, [dispatch, postId]);

  if (loading) {
    return <div>Loading post details...</div>;
  }

  if (!post) {
    return <div>No post found.</div>;
  }

  return (
    <div className="post-details-container">
      <h1 className="post-title">{post.title}</h1>
      <p className="post-body">{post.body}</p>

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div className="comment-item" key={comment.id}>
              <p>
                <strong>{comment.name}:</strong> {comment.body}
              </p>
            </div>
          ))
        ) : (
          <p>No comments available.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
