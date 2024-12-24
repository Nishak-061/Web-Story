import React, { useState } from "react";
import SlideshowPopup from "./SlideshowPopup";

const StoryCard = ({
  storyId,
  title,
  description,
  mediaUrl,
  onEdit,
  slides,
}) => {
  console.log("Slides:", slides); // This will show you what's being passed as 'slides'
  const [showPopup, setShowPopup] = useState(false);

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the card's onClick
    onEdit(); // Call the onEdit function passed as a prop
  };

  // Check if user is logged in
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isLoggedIn = !!token && !!userId; // true if both token and userId exist


  return (
    <div style={styles.card} onClick={() => setShowPopup(true)}>
      <div style={styles.mediaContainer}>
        <img src={mediaUrl} alt={title} style={styles.media} />
      </div>
      <div style={styles.content}>
        <h3>{title}</h3>
        <p>{description}</p>
        {isLoggedIn && (
        <button 
        style={styles.editButton} 
        //onClick={onEdit}
        onClick={handleEditClick}
        >
          Edit
        </button>
        )}
      </div>
      {showPopup && (
        <SlideshowPopup
          slides={slides}
          onClose={handlePopupClose}
          storyId={storyId}
          isLoggedIn={isLoggedIn} // Pass down login status
          //onClick={handleLikeClick}
        />
      )}
    </div>
  );
};

const styles = {
  card: {
    width: "257px",
    height: "500px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    overflow: "hidden",
    margin: "10px",
  },
  mediaContainer: {
    width: "100%",
    height: "70%", // 70% of the card height for the media
  },
  media: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    padding: "10px",
  },
  editButton: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default StoryCard;
