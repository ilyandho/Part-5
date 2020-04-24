import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/AddBlog';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('no-message');

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // Check if there is a logged in user in localStorage
  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInBlogAppUser');

    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      console.log(user);

      blogService.setToken(user.token);
      window.localStorage.setItem('loggedInBlogAppUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage('Wrong credentials. Check the username or password');
      setMessageType('error');
      setTimeout(() => {
        setMessage(null);
        setMessageType('no-message');
      }, 3000);

      console.log('could not login');
    }

    // console.log('logging in with', username, password);
  };

  const handleLogOut = async (event) => {
    console.log('logging out');
    window.localStorage.removeItem('loggedInBlogAppUser');
    setUser(null);
    blogService.setToken(null);
  };

  const handleAddBlogSubmit = async (event) => {
    event.preventDefault();
    console.log('added ', title, url);
    try {
      const newBlog = await blogService.create({ title, url });
      setBlogs([...blogs, newBlog]);
      setTitle('');
      setUrl('');
      setMessage(`a new blog ${newBlog.title} by ${user.name} added`);
      setMessageType('message');

      setTimeout(() => {
        setMessageType('no-message');
        setMessage(null);
      }, 5000);
    } catch (e) {
      console.log('Could not save the blog');
    }
  };

  if (user === null) {
    return (
      <div>
        <h3>Login to application</h3>
        <div className={messageType}>
          <p>{message}</p>
        </div>
        <LoginForm
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}></LoginForm>
      </div>
    );
  }
  return (
    <div>
      <h3>Blogs</h3>
      <div className={messageType}>
        <p>{message}</p>
      </div>
      <h5>
        {user.name} logged in <button onClick={handleLogOut}>Log Out</button>
      </h5>
      <AddBlogForm
        title={title}
        setTitle={setTitle}
        url={url}
        setUrl={setUrl}
        handleAddBlogSubmit={handleAddBlogSubmit}></AddBlogForm>{' '}
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
