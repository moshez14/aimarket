// LoginForm.js

import React from 'react';
import axios from 'axios';
import SignupFormComponent from './SignupForm';

const LoginForm = ({ handleLogin }) => {
  let loginUsername = '';
  let loginPassword = '';

  let loginError = '';
  let loginSuccess = false;
  let isLoggedIn = false;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/login', {
        name: loginUsername,
        password: loginPassword,
      });
      console.log('Login successful:', response.data);

      // Perform any necessary actions upon successful login
      loginSuccess = true;
      loginError = '';

      // Create a new MongoDB document
    } catch (error) {
      console.error('Error during login:', error);
      loginError = 'Invalid username or password';
    }

    loginSuccess = true;
    isLoggedIn = true;
  };
  const GreetingComponent = ({ username }) => {
    return (
      <div>
        <h2>Hello, {username}!</h2>
        <p>Thank you for logging in.</p>
        <p>start choosing your wish.</p>
        
      </div>
    );
  };
  return (
    <div className="container">
    <form onSubmit={handleLoginSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={loginUsername}
        onChange={(e) => (loginUsername = e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={loginPassword}
        onChange={(e) => (loginPassword = e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
    
    <div>
    {isLoggedIn ? (
    <GreetingComponent username={loginUsername} />
    ) : (
    <div>
    <div className="box">
    <SignupFormComponent />
    </div>
    <div className="box">
    <h2>Login</h2>
    <form onSubmit={handleLoginSubmit}>
      <label htmlFor="name">Username:</label>
      <input
        type="text"
        id="name"
        value={loginUsername}
        onChange={(e) => loginUsername(e.target.value)}
        required
      />
      <br />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={loginPassword}
        onChange={(e) => loginPassword(e.target.value)}
        required
      />
      <br />
      {loginError && <p className="error">{loginError}</p>}
      {loginSuccess && <p className="success">{loginSuccess}</p>}
      <button type="submit">Login</button>
    </form>
    </div>
    </div>
    )};
    </div>
    </div>
  );}

export default LoginForm;



/*
import React, { useState } from 'react';
import axios from 'axios';

/*const LoginForm = ({ handleLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/login', {
        name: loginUsername,
        password: loginPassword,
      });
      console.log('Login successful:', response.data);
              // Perform any necessary actions upon successful login
      setLoginSuccess('Login Success');
      setLoginError('');

      // Create a new MongoDB document
      
    } catch (error) {
      console.error('Error during login:', error);
      setLoginError('Invalid username or password');
    }
      
      setLoginSuccess(true);
      setIsLoggedIn(true);
      };

 /* const handleSubmit = (e) => {
    e.preventDefault();
    // Call the handleLogin function passed from the parent component
    handleLogin({ name, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
};

export default handleLoginSubmit;*/