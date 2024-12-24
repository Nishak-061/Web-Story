import React, { useEffect, useState } from 'react'
import "../Styles/navbar.css"
import { useNavigate } from 'react-router-dom';
import Register from './Register'
import SignIn from './SignIn';
import AddStory from './AddStory';
import Stories from './Stories';
import { FaBookmark } from "react-icons/fa";
import axios from 'axios';

const Navbar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token')); // Check if the user is logged in
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);
  const [storyData, setStoryData] = useState(null); // State to hold the story data
  const [stories, setStories] = useState([]);
  
  const navigate = useNavigate();

  const handleBookmarkClick = () => {
    navigate('/bookmarks'); // Redirect to the bookmarks page
};

  const fetchStories = async () => {
    try {
      const response = await axios.get('https://web-story-g7m0.onrender.com/stories');
      if (response.status === 200) {
        setStories(response.data); 
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleRegisterClick = () => {
    setShowRegister(true)
  }
  const handleCloseRegister = () => {
    setShowRegister(false)
  }

  const handleSignInClick = () => {
    setShowSignIn(true)
  }

  const handleCloseSignIn = () => {
    setShowSignIn(false)
  }

  const handleAddStoryClick = () => {
    setShowAddStory(true); // Show AddStory modal
  };

  const handleCloseAddStory = () => {
    setShowAddStory(false); // Close AddStory modal
  };

  // Simulate login logic for demo purposes (replace with real API call)
  const handleLoginSuccess = (data) => {
    const { token, username } = data; // Get username from API response
    localStorage.setItem('token', token);
    localStorage.setItem('username', username); // Store username in localStorage
    setIsLoggedIn(true);
    setShowSignIn(false); // Close sign-in modal after successful login
  };

  const handleHamburgerClick = () => {
    setShowHamburgerMenu(!showHamburgerMenu); // Toggle the hamburger menu
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setShowHamburgerMenu(false);
  };

  // Get username from localStorage
  const username = localStorage.getItem("username") || "User"; // Fallback to "User" if username is missing
  //console.log("Username from localStorage:", username);

  const loadStoryData = (story) => {
    setStoryData(story); // Set the story data to be edited
    handleAddStoryClick(); // Show the AddStory modal
  };

  return (
    <>
    <div className='navbar-container'>
      {!isLoggedIn ? (
        <div className='navbar-buttons'>
        <button className='navbar-btn-register' onClick={handleRegisterClick}>Register Now</button>
        <button className='navbar-btn-signin' onClick={handleSignInClick}>Sign In</button>
      </div>
      ) : (
        <div className='navbar-buttons'>
          <button className='navbar-btn-bookmarks' onClick={handleBookmarkClick}> <FaBookmark className='bookmark-font'/> Bookmarks</button>
          <button className='navbar-btn-addstory' onClick={handleAddStoryClick}>Add Story</button>
          <button className='navbar-btn-hamburger' onClick={handleHamburgerClick}>☰</button> {/* Hamburger icon */}
        </div>
      )}
      
      {showHamburgerMenu && isLoggedIn && (
        <div className="hamburger-menu-dropdown">
          <p className='username-para'>{username}</p> {/* Dynamic username from localStorage */}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}

      {showRegister && <Register onClose={handleCloseRegister} />}
      {showSignIn && <SignIn onClose={handleCloseSignIn} onLoginSuccess={handleLoginSuccess} />}

      {showAddStory && <AddStory onClose={handleCloseAddStory} existingStory={storyData} fetchStories={fetchStories}/>}

      
    </div>
    <Stories loadStoryData={loadStoryData}/>
    </>
  )
}

export default Navbar
