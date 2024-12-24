import React, { useState } from 'react';
import "../Styles/signin.css";
import Close from "./Vector.jpg"
import { GoEyeClosed } from "react-icons/go";
import { RxEyeOpen } from "react-icons/rx";
import axios from 'axios';

const SignIn = ({ onClose, onLoginSuccess }) => {
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post('https://web-story-g7m0.onrender.com/auth/login', {
        username,
        password,
      });

      // If login is successful
      if (response.data.token) {
        // Store the token (you can use localStorage or cookies)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username); // Store the username
        localStorage.setItem('userId', response.data.userId); // Store the userId

        // Log the username and token for debugging
        console.log("Logged in as:", response.data.username);
        console.log("Token:", response.data.token);
        console.log("User ID:", response.data.userId); // Log the userId for debugging

        // Trigger login success action in parent
        onLoginSuccess(response.data);  // Pass token and username to parent
      }
    } catch (error) {
      // Handle error (e.g., wrong credentials)
      setErrorMessage('Invalid username or password');
      console.log('Login error:', error.response?.data?.message || error);
    }
  };



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className='login-font'>Login</h2>
        <form onSubmit={handleSubmit}>

          <div className='username-password-container'>
          <div className='username-container'>
            <label className='username-font'>Username</label>
            <input type="text"  value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter username' className='username-box' required />
          </div>
          <div className="password-container">
            <label className='password-font'>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='password-box'
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <RxEyeOpen /> : <GoEyeClosed />}
            </span>
          </div>
          </div>

          {errorMessage && <p className="error">{errorMessage}</p>}
          <button type="submit" className='submit'>Sign In</button>
        </form>
        <div className="close-btn" onClick={onClose}>
        <img src={Close} alt='close'/>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
