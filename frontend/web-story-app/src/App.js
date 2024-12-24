import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar'
import Register from './Components/Register'
import SignIn from './Components/SignIn'
import AddStory from './Components/AddStory';
import StoryCard from './Components/StoryCard';
import SlideshowPopup from './Components/SlideshowPopup';
import BookmarkPage from './Components/BookmarkPage';
import PublicStory from './Components/PublicStory';

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Navbar />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<SignIn />} />
      <Route path='/add-story' element={<AddStory />} />
      <Route path='/story-card' element={<StoryCard />} />
      <Route path='/slideshow' element={<SlideshowPopup />} />
      <Route path='/bookmarks' element={<BookmarkPage />} />
      <Route path="/public-story/:storyId" element={<PublicStory />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
