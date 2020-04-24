import React from 'react';

const AddBlogForm = ({ title, setTitle, url, setUrl, handleAddBlogSubmit }) => {
  return (
    <form onSubmit={handleAddBlogSubmit}>
      <h3>Create a new blog</h3>
      <div>
        Blog title:{' '}
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Blog url:{' '}
        <input value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default AddBlogForm;
