import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./style.css";

function UpdateModal({
  show,
  handleCloseModal,
  currentPost,
  handleChangedData,
  handleUpdatePost,
  errors,
  touchedFields,
  handleBlur,
  isButtonDisabled
}) {
  return (
    <div>
      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add-post-form">
            <input
              type="text"
              className={`form-control mb-2 ${errors.title && touchedFields.title ? "is-invalid" : ""}`}
              placeholder="Title"
              value={currentPost.title}
              onChange={(e) => handleChangedData({ ...currentPost, title: e.target.value })}
              onBlur={() => handleBlur("title")}
            />
            {errors.title && touchedFields.title && <div className="invalid-feedback">{errors.title}</div>}

            <textarea
              className={`form-control mb-2 ${errors.body && touchedFields.body ? "is-invalid" : ""}`}
              placeholder="Body"
              rows="4"
              value={currentPost.body}
              onChange={(e) => handleChangedData({ ...currentPost, body: e.target.value })}
              onBlur={() => handleBlur("body")}
            />
            {errors.body && touchedFields.body && <div className="invalid-feedback">{errors.body}</div>}
          </div>
        </Modal.Body>
        <Modal.Footer className="modalFooter">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>

          <Button variant="primary" onClick={handleUpdatePost} disabled={isButtonDisabled}>
            Update Post
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UpdateModal;
