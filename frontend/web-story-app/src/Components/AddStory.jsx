import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Styles/AddStory.css"

const AddStory = ({ onClose, existingStory, fetchStories }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([
    { title: '', description: '', mediaUrl: '', category: '' }, // Slide 1
    { title: '', description: '', mediaUrl: '', category: '' }, // Slide 2
    { title: '', description: '', mediaUrl: '', category: '' }, // Slide 3
  ]);
  const [errorMessage, setErrorMessage] = useState('');
  const [videoDurationError, setVideoDurationError] = useState('');

  useEffect(() => {
    if (existingStory && Array.isArray(existingStory.slides)) {
      console.log("Existing Story Slides:", existingStory.slides); // Log the slides for inspection
  
      const prefilledSlides = existingStory.slides.map(slide => ({
        title: slide.title || '',
        description: slide.description || '',
        mediaUrl: slide.mediaUrl || '',
        category: slide.category || '', // Ensure category is set correctly
      }));
      console.log("Prefilled Slides:", prefilledSlides); // Check prefilled data
      setSlides(prefilledSlides); // Use the mapped slides
      setActiveSlide(0); // Set the first slide active
    }
  }, [existingStory]);
  

  // Handle slide change
  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  const handleFieldChange = (field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[activeSlide][field] = value;
    setSlides(updatedSlides);

    if (field === 'mediaUrl' && value) {
      validateMediaUrl(value);
    } else {
      setVideoDurationError('');
    }
  };

  const validateMediaUrl = (url) => {
    const videoFormats = ['.mp4', '.webm', '.ogg']; 
    const isVideoFormat = videoFormats.some(format => url.endsWith(format)); 

    if (isVideoFormat) {
      checkVideoDuration(url);
    } else {
      setVideoDurationError('');
    }
  };

  const checkVideoDuration = (url) => {
    const video = document.createElement('video');
    video.src = url;

    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (duration > 15) {
        setVideoDurationError('Video length is too lengthy. Keep it under 15 seconds.');
      } else {
        setVideoDurationError('');
      }
    };

    video.onerror = () => {
      setVideoDurationError('Invalid video URL. Please provide a valid one.');
    };
  };


  // Add a new slide
  const addSlide = () => {
    if (slides.length < 6) {
      setSlides([...slides, { title: '', description: '', mediaUrl: '', category: '' }]);
    }
  };

  // Remove a slide
  const removeSlide = (index) => {
    if (slides.length > 3) {
      const updatedSlides = slides.filter((_, i) => i !== index);
      setSlides(updatedSlides);
      if (index === activeSlide) {
        setActiveSlide(activeSlide > 0 ? activeSlide - 1 : 0);
      }
    }
  };






  const handlePost = async () => {
    if (videoDurationError) {
      setErrorMessage(videoDurationError);
      return; // Prevent posting if there's a video duration error
    }
    console.log('Submitting story:', slides); // Log the slides being submitted
    console.log('Payload for POST:', {
      title: slides[0].title,
      description: slides[0].description,
      category: slides[0].category,
      slides,
    });
  
    try {
      if (existingStory) {
        // Prepare the updated slides, keeping the original values if no change was made
        const updatedSlides = slides.map((slide, index) => ({
          title: slide.title || existingStory.slides[index].title,
          description: slide.description || existingStory.slides[index].description,
          mediaUrl: slide.mediaUrl || existingStory.slides[index].mediaUrl,
          category: slide.category || existingStory.slides[index].category,
        }));
  
        const updatedStory = {
          title: updatedSlides[0].title, // Update only the changed fields
          description: updatedSlides[0].description,
          category: updatedSlides[0].category,
          slides: updatedSlides,
        };
  
        const response = await axios.put(`http://localhost:8080/stories/${existingStory._id.trim()}`, updatedStory);
        console.log('Update response:', response.data); // Log the response from the server
  
        if (response.status === 200 || response.status === 204) {
          alert('Story updated successfully');
          fetchStories(); // Refresh the stories list to reflect the changes
          onClose(); // Close the dialog on success
        }
      } else {
        // Creating a new story
        const response = await axios.post('http://localhost:8080/stories', {
          title: slides[0].title,
          description: slides[0].description,
          category: slides[0].category,
          slides,
        });
  
        console.log('Post response:', response.data); // Log the response from the server
        if (response.status === 201) {
          alert('Story posted successfully');
          fetchStories(); // Optionally refresh
          onClose(); // Close the dialog on success
        }
      }
    } catch (error) {
      console.error('Error posting/updating the story:', error);
      setErrorMessage('Failed to post stories');
    }
  };
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* <h2>Add Story</h2> */}
        <div className="slide-buttons">
          {slides.map((_, index) => (
            <button key={index} onClick={() => handleSlideChange(index)} className='slide-btn'>
              {`Slide ${index + 1}`}
              {index >= 3 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSlide(index);
                  }}
                  style={{ marginLeft: '10px', cursor: 'pointer', color: 'red' }}
                >
                  X
                </span>
              )}
            </button>
          ))}
        </div>
        
        {slides[activeSlide] && (
          <>
            <div className='all-items'>
              <label className='heading-font'>Heading:</label>
              <input type="text" value={slides[activeSlide].title || ''} onChange={(e) => handleFieldChange('title', e.target.value)} className='heading-box' placeholder='Your heading'/>
            </div>
            <div>
              <label className='description-font'>Description:</label>
              <textarea value={slides[activeSlide].description || ''} onChange={(e) => handleFieldChange('description', e.target.value)} className='description-box' placeholder='Story Description'/>
            </div>
            <div>
              <label className='image-font'>Image:</label>
              <input type="text" value={slides[activeSlide].mediaUrl || ''} onChange={(e) => handleFieldChange('mediaUrl', e.target.value)} className='image-box' placeholder='Add Image url'/>
            </div>
            {videoDurationError && <p className="error">{videoDurationError}</p>}

            <div>
              <label className='category-font'>Category:</label>
              <select value={slides[activeSlide].category || ''} onChange={(e) => handleFieldChange('category', e.target.value)} className='category-box'>
                <option value="">Select Category</option>
                <option value="food">Food</option>
                <option value="books">Books</option>
                <option value="travel">Travel</option>
                <option value="health and fitness">Health & Fitness</option>
                <option value="movie">Movie</option>
              </select>
            </div>
          </>
        )}

        {slides.length < 6 && <button onClick={addSlide}>Add Slide</button>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button onClick={handlePost}>Post</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddStory;

