import React, { useEffect, useState } from "react";
import "../Styles/SlideshowPopup.css"; // Add your CSS for styling
import { PiBookmarkSimpleLight } from "react-icons/pi";
import { FaRegHeart, FaHeart, FaDownload, FaCheck } from "react-icons/fa";
import axios from "axios";

const SlideshowPopup = ({ slides = [], onClose, storyId, isLoggedIn }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bookmarked, setBookmarked] = useState(false); // Track bookmark state
  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage or context
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  const [shareLink, setShareLink] = useState("");
  const [shareMessageVisible, setShareMessageVisible] = useState(false); // State for share message visibility
  // const [likedSlides, setLikedSlides] = useState([]);  // Track which slides are liked by the user
  // const [likeCounts, setLikeCounts] = useState([]);    // Track the number of likes for each slide
  const [likedSlides, setLikedSlides] = useState(
    Array(slides.length).fill(false)
  ); // Track which slides the user has liked
  const [likeCounts, setLikeCounts] = useState(Array(slides.length).fill(0)); // Track the total likes
  const [downloaded, setDownloaded] = useState(false); // Track download state

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/stories/${storyId}/likes`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId }, // Pass userId as query parameter
          }
        );

        const { likedSlides: likedData, likeCounts: likeData } = response.data;

        // Log the fetched data
        console.log("Fetched liked slides:", likedData);
        console.log("Fetched like counts:", likeData);

        if (isLoggedIn) {
          // Directly map to initialize likedSlides and likeCounts
          const initialLikedSlides = slides.map((slide) =>
            likedData.includes(slide._id)
          );
          setLikedSlides(initialLikedSlides); // Set liked states for slides
        }

        const initialLikeCounts = slides.map(
          (slide) => likeData[slide._id] || 0
        );
        setLikeCounts(initialLikeCounts); // Set like counts for slides
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    if (storyId && slides.length > 0) {
      fetchLikeStatus();
    }
  }, [storyId, token, slides, userId, isLoggedIn]);

  const toggleLike = async (slideIndex) => {
    if (!isLoggedIn) {
      // Redirect to sign-in page or show an alert
      alert("You need to be signed in to like a slide. Please log in.");
      return;
    }

    if (
      !slides ||
      slides.length === 0 ||
      slideIndex < 0 ||
      slideIndex >= slides.length
    ) {
      console.error("Invalid slide index or slides array:", {
        slides,
        slideIndex,
      });
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/stories/like`,
        {
          userId,
          storyId,
          slideId: slides[slideIndex]._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { liked, likes } = response.data;
      console.log("Response from server:", response.data);

      // Update the liked state and like count for this specific slide
      const updatedLikedSlides = [...likedSlides];
      updatedLikedSlides[slideIndex] = liked; // Update liked status
      setLikedSlides(updatedLikedSlides);

      const updatedLikeCounts = [...likeCounts];
      //updatedLikedSlides[slideIndex] = liked; // Update only the specific slide
      updatedLikeCounts[slideIndex] = likes; // Update like count for this slide

      //setLikedSlides(updatedLikedSlides);
      setLikeCounts(updatedLikeCounts);

      console.log(
        `Liked slide with ID: ${slides[slideIndex]._id}, Total Likes: ${likes}`
      );
    } catch (error) {
      console.error("Error liking slide:", error);
    }
  };

  useEffect(() => {
    if (storyId) {
      const generatedLink = `${window.location.origin}/public-story/${storyId}`;
      setShareLink(generatedLink);
    }
  }, [storyId]);

  // Function to copy the share link to the clipboard
  const copyShareLink = () => {
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        setShareMessageVisible(true); // Show the share message box
      })
      .catch((error) => {
        console.error("Failed to copy the link: ", error);
      });
  };

  // if (!token) {
  //     console.error('User is not logged in'); // Handle user not being logged in
  //     return null; // You can also show a message or redirect to login
  // }

  if (!userId) {
    console.error("User is not logged in"); // Handle user not being logged in
    return null; // You can also show a message or redirect to login
  }

  if (slides.length === 0) {
    return <div>No slides available</div>; // Show this if there are no slides
  }

  
  const handleDownload = () => {
    const mediaUrl = slides[currentSlide].mediaUrl;
    const link = document.createElement("a");
  
    try {
      if (mediaUrl.endsWith(".mp4")) {
        // Handle direct video download
        link.href = mediaUrl;
        link.download = `slide-${currentSlide + 1}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (mediaUrl.startsWith("data:")) {
        // Handle base64 data URL
        fetch(mediaUrl)
          .then((res) => res.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const fileExtension = blob.type.split("/")[1] || 'jpg'; // Use blob's MIME type
            link.href = blobUrl;
            link.download = `slide-${currentSlide + 1}.${fileExtension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          })
          .catch((error) => console.error("Download failed: ", error));
      } else {
        // Handle direct image URL download
        fetch(mediaUrl, { mode: 'cors' })  // Ensure cross-origin handling
          .then(response => {
            const contentType = response.headers.get("content-type");
            return response.blob().then(blob => {
              const blobUrl = URL.createObjectURL(blob);
              const extension = contentType?.split("/")[1] || 'jpg';  // Use content-type or default to jpg
              link.href = blobUrl;
              link.download = `slide-${currentSlide + 1}.${extension}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            });
          })
          .catch((error) => console.error("Error downloading file: ", error));
      }
  
      setDownloaded(true); // Update download state
    } catch (error) {
      console.error("Error in download: ", error);
    }
  };
  
  
  
  

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setDownloaded(false); // Reset download state when changing slides
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setDownloaded(false); // Reset download state when changing slides
  };

  const toggleBookmark = async () => {
    if (!isLoggedIn) {
      alert("You need to be signed in to bookmark this story.");
      return;
    }
    if (!storyId) {
      console.error("storyId is missing");
      alert("Story ID is required to bookmark the story."); // Alert user
      return; // Exit early if storyId is missing
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/bookmarks/bookmark",
        {
          userId: localStorage.getItem("userId"), // Include userId from localStorage
          storyId: storyId, // Ensure storyId is included
          //storyId: slides[currentSlide]._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include token if required
        }
      );
      setBookmarked(!bookmarked);
      alert(response.data.message); // Show alert with success message
    } catch (error) {
      console.error("Error bookmarking story:", error);
      alert(
        "Error bookmarking story: " + error.response?.data?.message ||
          "Unknown error"
      ); // Alert on error
    }
  };

  return (
    <div className="slideshow-popup">
      <div className="slideshow-content">
        <div className="slideshow-bars">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`bar ${index === currentSlide ? "active" : ""}`}
            />
          ))}
        </div>
        <div className="slideshow-footer">
          <button className="close-icon" onClick={onClose}>
            ❌
          </button>
          <button className="share-icon" onClick={copyShareLink}>
            Share
          </button>
        </div>
        <div className="slideshow-image">
          {slides[currentSlide].mediaUrl.endsWith(".mp4") ? (
            <video src={slides[currentSlide].mediaUrl} autoPlay loop />
          ) : (
            <img src={slides[currentSlide].mediaUrl} alt="Slide" />
          )}
        </div>

        {/* Share message box */}
        {shareMessageVisible && (
          <div className="share-message-box">Link copied to clipboard</div>
        )}

        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].description}</p>
        <div className="icons">
          <span className="bookmark-icon" onClick={toggleBookmark}>
            <PiBookmarkSimpleLight
              style={{
                color: isLoggedIn ? (bookmarked ? "white" : "blue") : "white",
              }}
            />
          </span>

          {/* Download icon (or tick icon if downloaded) */}
          {isLoggedIn && (
            <span className="download-icon" onClick={handleDownload}>
              {downloaded ? (
                <FaCheck style={{ color: "green" }} />
              ) : (
                <FaDownload style={{ color: "white" }} />
              )}
            </span>
          )}

          {/* <span className="heart-icon"><FaRegHeart /></span> */}
          <span className="heart-icon" onClick={() => toggleLike(currentSlide)}>
            {likedSlides[currentSlide] ? (
              <FaHeart style={{ color: "red" }} />
            ) : (
              <FaRegHeart style={{ color: "white" }} />
            )}
          </span>

          {/* <span>{likeCounts[currentSlide]} likes</span> */}
          {/* Display the likes count */}
          <span style={{ color: "white", marginLeft: "5px" }}>
            {/* {likedSlides[currentSlide] ? likedSlides[currentSlide] : 0} */}
            {likeCounts[currentSlide]}
          </span>
        </div>
      </div>

      <button className="prev" onClick={prevSlide}>
        ❮
      </button>
      <button className="next" onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
};

export default SlideshowPopup;
