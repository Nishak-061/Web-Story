import React, { useState } from "react";
import "../Styles/register.css";
import { GoEyeClosed } from "react-icons/go";
import { RxEyeOpen } from "react-icons/rx";
import Close from "./Vector.jpg";
import axios from "axios";

const Register = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://web-story-g7m0.onrender.com/auth/register", {
        username,
        password,
      });
      console.log("Registration successful:", response.data);
      onClose(); // Close the modal after registration
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="login-font">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="username-password-container">
            <div className="username-container">
              <label className="username-font">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="username-box"
                required
              />
            </div>
            <div className="password-container">
              <label className="password-font">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-box"
                required
              />

              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <RxEyeOpen /> : <GoEyeClosed />}
              </span>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          <button type="submit" className="submit">
            Register
          </button>
        </form>
        <div className="close-btn" onClick={onClose}>
          <img src={Close} alt="close" />
        </div>
      </div>
    </div>
  );
};

export default Register;
