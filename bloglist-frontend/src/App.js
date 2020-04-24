import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/AddBlogForm';
import Toggable from './components/Toggable';
import './App.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('no-message');

  const createBlogRef = React.createRef();

  // Sort the blogs by most likes
  const sortBlogs = (array) => {
    const sorted = array.sort((a, b) => {
      return b.likes - a.likes;
    });
    console.log(sorted);
    return sorted;
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortBlogs(blogs)));
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

  const handleLogOut = async () => {
    console.log('logging out');
    window.localStorage.removeItem('loggedInBlogAppUser');
    setUser(null);
    blogService.setToken(null);
  };

  const addBlog = async (obj) => {
    try {
      createBlogRef.current.toggleVisibility();
      const newBlog = await blogService.create(obj);
      const newBlogs = [...blogs, newBlog];
      setBlogs(sortBlogs(newBlogs));
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

  const updateBlog = async (id, obj) => {
    console.log(id, obj);
    try {
      const response = await blogService.update(id, obj);
      const updatedBlogs = await blogs.map((blog) => {
        if (blog.id === response.id) {
          blog.likes += 1;
        }
        return blog;
      });

      setBlogs(sortBlogs(updatedBlogs));
    } catch (err) {
      console.log('no update made');
    }
  };

  const deleteBlog = async (obj) => {
    console.log('obj', obj);

    if (window.confirm(`Remove blog ${obj.title}`)) {
      try {
        const respo = await blogService.remove(obj.id);
        console.log('delete res', respo);
        setMessageType('message');
        setMessage(`${obj.title} has been deleted`);
        setTimeout(() => {
          setMessageType('no-message');
          setMessage(null);
        }, 5000);

        const remainingBlogs = blogs.filter((blog) => blog.id !== obj.id);

        setBlogs(remainingBlogs);
      } catch (err) {
        console.log('error', err.response);
        setMessageType('error');
        setMessage(err.response.data.error);
        setTimeout(() => {
          setMessageType('no-message');
          setMessage(null);
        }, 5000);
        return err.response.data.error;
      }
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
      <Toggable showButtonLabel="New Bolg" ref={createBlogRef}>
        <AddBlogForm addBlog={addBlog}></AddBlogForm>
      </Toggable>
      {blogs.map((blog) => (
        <Blog
          user={user}
          blog={blog}
          key={blog.id}
          update={updateBlog}
          deleteBlog={deleteBlog}
        />
      ))}
    </div>
  );
};

export default App;
