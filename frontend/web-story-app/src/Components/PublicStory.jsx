import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaBookmark, FaTimes, FaShareAlt } from 'react-icons/fa';
import '../Styles/SlideshowPopup.css'; // Add your CSS for styling

const PublicStory = () => {
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/stories/public/${storyId}`);
                console.log(response.data);  // Check what data is being returned
                setStory(response.data);
            } catch (error) {
                console.error('Error fetching story:', error);
            }
        };
        fetchStory();
    }, [storyId]);

    const handleNextSlide = () => {
        if (currentSlide < story.slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePreviousSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleClose = () => {
        navigate(-1); // Go back
    };

    if (!story) {
        return <div>Loading...</div>;
    }

    return (
        <div className="slideshow-popup">
            {/* Slideshow bars indicating the number of slides */}
            <div className="slideshow-bars">
                {story.slides.map((_, index) => (
                    <div
                        key={index}
                        className={`slideshow-bar ${index === currentSlide ? 'active' : ''}`}
                    ></div>
                ))}
            </div>

            {/* Slide content */}
            <div className="slideshow-slide">
                <div className="slideshow-media">
                    {story.slides[currentSlide].mediaUrl.endsWith('.mp4') ? (
                        <video src={story.slides[currentSlide].mediaUrl} controls />
                    ) : (
                        <img src={story.slides[currentSlide].mediaUrl} alt={story.slides[currentSlide].title} />
                    )}
                </div>
                <div className="slideshow-info">
                    <h2>{story.slides[currentSlide].title}</h2>
                    <p>{story.slides[currentSlide].description}</p>
                </div>

                {/* Like and bookmark icons */}
                <div className="slideshow-actions">
                    <div className="like-container">
                        <FaHeart className="icon heart" /> {/* Heart icon */}
                        {/* Display the number of likes (length of likes array) */}
                        <span>{story.slides[currentSlide].likes.length}</span> {/* Like count */}
                    </div>
                    <FaBookmark className="icon bookmark" /> {/* Bookmark icon */}
                </div>
            </div>

            {/* Navigation buttons */}
            <div className="slideshow-controls">
                {currentSlide > 0 && <button onClick={handlePreviousSlide} className="previous-slide">Previous</button>}
                {currentSlide < story.slides.length - 1 && <button onClick={handleNextSlide} className="next-slide">Next</button>}
            </div>

            {/* Close and share icons */}
            <div className="slideshow-header">
                <FaTimes className="icon close" onClick={handleClose} />
                <FaShareAlt className="icon share" /> {/* Add logic for sharing */}
            </div>
        </div>
    );
};

export default PublicStory;









// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const PublicStory = () => {
//     const { storyId } = useParams();  // Get storyId from URL params
//     const [story, setStory] = useState(null);

//     useEffect(() => {
//         const fetchStory = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/stories/public/${storyId}`);
//                 setStory(response.data);
//             } catch (error) {
//                 console.error('Error fetching story:', error);
//             }
//         };
//         fetchStory();
//     }, [storyId]);

//     if (!story) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div>
//             <h1>{story.title}</h1>
//             {story.slides.map((slide, index) => (
//                 <div key={index}>
//                     {slide.mediaUrl.endsWith('.mp4') ? (
//                         <video src={slide.mediaUrl} controls />
//                     ) : (
//                         <img src={slide.mediaUrl} alt={slide.title} />
//                     )}
//                     <h2>{slide.title}</h2>
//                     <p>{slide.description}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default PublicStory;
