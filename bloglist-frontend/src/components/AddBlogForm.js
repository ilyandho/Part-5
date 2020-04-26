import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AddBlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog({
      title,
      url,
    });

    setTitle('');
    setUrl('');
  };
  return (
    <form onSubmit={handleSubmit} id="form">
      <h3>Create a new blog</h3>
      <div>
        Blog title:{' '}
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          className="title"
        />
      </div>
      <div>
        Blog url:{' '}
        <input
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          className="url"
        />
      </div>
      <button type="submit" id="createBtn">
        create
      </button>
    </form>
  );
};

AddBlogForm.prototype = {
  addBlog: PropTypes.func.isRequired,
};

export default AddBlogForm;
