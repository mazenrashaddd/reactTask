import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, addPost, updatePost, deletePost } from "../../../APIs/postsApis";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faAdd } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import UpdateModal from "./UpdateModal";
import { Link } from "react-router-dom";

function Home() {
  const allPosts = useSelector((state) => state.postsData.posts);
  const dispatch = useDispatch();

  // States for Adding Post
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [addPostErrors, setAddPostErrors] = useState({});
  const [addPostTouchedFields, setAddPostTouchedFields] = useState({ title: false, body: false });
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);

  // States for Updating Post
  const [currentPost, setCurrentPost] = useState({ title: "", body: "" });
  const [updatePostErrors, setUpdatePostErrors] = useState({});
  const [updatePostTouchedFields, setUpdatePostTouchedFields] = useState({ title: false, body: false });
  const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch posts on mount
  useEffect(() => {
    if (!allPosts.length) {
      dispatch(fetchPosts()).then(() => setLoading(false));
    }
  }, [dispatch, allPosts.length]);

  // Validation for Add Post
  useEffect(() => {
    validateForm(newPost, setAddPostErrors, setIsAddButtonDisabled);
  }, [newPost]);

  // Validation for Update Post
  useEffect(() => {
    validateForm(currentPost, setUpdatePostErrors, setIsUpdateButtonDisabled);
  }, [currentPost]);

  // Common validation logic for both add and update forms
  const validateForm = (post, setErrorState, setButtonDisabledState) => {
    const newErrors = {};
    if (!post.title || post.title.length < 10 || post.title.length > 150) {
      newErrors.title = "Title must be between 10 and 150 characters.";
    }
    if (!post.body || post.body.length < 50 || post.body.length > 300) {
      newErrors.body = "Body must be between 50 and 300 characters.";
    }
    setErrorState(newErrors);
    setButtonDisabledState(Object.keys(newErrors).length > 0); // Disable button if there are any errors
  };

  // Handle adding a new post
  const handleAddPost = () => {
    if (!isAddButtonDisabled) {
      dispatch(addPost(newPost)).then(() => {
        setNewPost({ title: "", body: "" });
        setAddPostTouchedFields({ title: false, body: false });
        toast.success("Your post has been added successfully");
      });
    }
  };

  // Handle updating a post
  const handleUpdatePost = () => {
    if (!isUpdateButtonDisabled) {
      const updatedPostData = { title: currentPost.title, body: currentPost.body };
      dispatch(updatePost({ id: currentPost.id, updatedData: updatedPostData }))
        .finally(() => {
          handleCloseModal();
          toast.success("Your post has been updated successfully");
        });
    }
  };

  const handleShowModal = (post) => {
    setShow(true);
    setCurrentPost(post);
  };

  const handleDeletePost = (id) => {
    dispatch(deletePost(id)).then(() => {
      toast.success("Post deleted successfully!");
    });
  };

  const handleCloseModal = () => setShow(false);

  const handleBlurAddPost = (field) => {
    setAddPostTouchedFields({ ...addPostTouchedFields, [field]: true });
  };

  const handleBlurUpdatePost = (field) => {
    setUpdatePostTouchedFields({ ...updatePostTouchedFields, [field]: true });
  };

  return (
    <>
      <div className="posts-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {allPosts.map((post) => (
                <div className="card post-item" key={post.id}>
                  <div className="card-body">
                    <h5>
                      <Link to={`/post-details/${post.id}`}>
                        {post.id} - {post.title}
                      </Link>
                    </h5>
                    <p className="card-text">{post.body}</p>
                    <div className="postControlButtons">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleShowModal(post)}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Update
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn btn-danger"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4">
              <div className="add-post-form">
                <input
                  type="text"
                  className={`form-control mb-2 ${addPostErrors.title && addPostTouchedFields.title ? "is-invalid" : ""}`}
                  placeholder="Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  onBlur={() => handleBlurAddPost("title")}
                />
                {addPostErrors.title && addPostTouchedFields.title && <div className="invalid-feedback">{addPostErrors.title}</div>}
                
                <textarea
                  className={`form-control mb-2 ${addPostErrors.body && addPostTouchedFields.body ? "is-invalid" : ""}`}
                  placeholder="Body"
                  rows="4"
                  value={newPost.body}
                  onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                  onBlur={() => handleBlurAddPost("body")}
                />
                {addPostErrors.body && addPostTouchedFields.body && <div className="invalid-feedback">{addPostErrors.body}</div>}
                
                <button
                  className="btn btn-success"
                  onClick={handleAddPost}
                  disabled={isAddButtonDisabled}
                >
                  <FontAwesomeIcon icon={faAdd} /> Add Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdateModal
        show={show}
        handleCloseModal={handleCloseModal}
        currentPost={currentPost}
        handleChangedData={setCurrentPost}
        handleUpdatePost={handleUpdatePost}
        errors={updatePostErrors}
        touchedFields={updatePostTouchedFields}
        handleBlur={handleBlurUpdatePost}
        isButtonDisabled={isUpdateButtonDisabled}
      />
      <ToastContainer />
    </>
  );
}

export default Home;
