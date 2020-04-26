import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, update, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    const blogId = blog.id;
    const updatedLikes = blog.likes + 1;
    update(blogId, { likes: updatedLikes });
  };

  const handleDelete = () => {
    deleteBlog(blog);
  };
  return (
    <div style={blogStyle} className="singleBlog">
      <div style={hideWhenVisible} className="previewContent">
        {blog.title} {blog.author} (likes: {blog.likes})
        <button onClick={toggleVisibility} className="viewBtn">
          view
        </button>{' '}
        <button onClick={handleLike} className="like">
          Like
        </button>
        {blog.user.username === user.username ? (
          <button onClick={handleDelete}>Delete</button>
        ) : (
          ''
        )}
      </div>

      <div style={showWhenVisible} className="toggableContent">
        <h4>{blog.title}</h4>
        <h4> {blog.url} </h4>
        <h4> {blog.name}</h4>
        <h4> {blog.author}</h4>
        <h4 className="blogLikes">
          {' '}
          {blog.likes} <button onClick={handleLike}>Like</button>
        </h4>
        <button onClick={handleDelete} className="deleteBtn">
          Delete
        </button>
        <button onClick={toggleVisibility} className="hideBtn">
          hide
        </button>
      </div>
    </div>
  );
};

Blog.prototype = {
  blog: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};
export default Blog;
