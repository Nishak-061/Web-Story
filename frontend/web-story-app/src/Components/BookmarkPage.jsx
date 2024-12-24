import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookmarkPage = () => {
    const [bookmarkedStories, setBookmarkedStories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await axios.get('https://web-story-g7m0.onrender.com/bookmarks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Fetched bookmarks:', response.data); // Log the fetched bookmarks
                setBookmarkedStories(response.data);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
                setError('Failed to fetch bookmarks. Please try again later.');
            }
        };

        fetchBookmarks();
    }, []);

    return (
      



<>
<div style={styles.container}>
<h1>Your Bookmarked Stories</h1>
{error && <p style={styles.error}>{error}</p>}
{bookmarkedStories.length > 0 ? (
    <div style={styles.storyList}>
        {bookmarkedStories.map(bookmark => {
            console.log('Bookmark:', bookmark); // Check if bookmark is populated
            if (bookmark && bookmark.story) {
                console.log('Bookmark story:', bookmark.story); // Log the story object
                const slides = bookmark.story.slides || [];
                console.log('Slides:', slides); // Log the slides array
                const mediaUrl = slides.length > 0 ? slides[0].mediaUrl : null; // Access first slide's mediaUrl
                console.log('Media URL:', mediaUrl); // Log mediaUrl for troubleshooting

                return (
                    <div key={bookmark._id} style={styles.storyCard}>
                        <h2>{bookmark.story.title}</h2>
                        <p>{bookmark.story.description}</p>
                        {mediaUrl ? (
                            mediaUrl.endsWith('.mp4') ? (
                                <video src={mediaUrl} controls style={styles.media} />
                            ) : (
                                <img src={mediaUrl} alt={bookmark.story.title} style={styles.media} />
                            )
                        ) : (
                            <p>No media available</p> // Fallback if mediaUrl is missing
                        )}
                    </div>
                );
            } else {
                console.log('No bookmark or story found');
                return null; // Handle cases where bookmark or story is null
            }
        })}
    </div>
) : (
    <p>No bookmarks yet.</p>
)}
</div>
</>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    error: {
        color: 'red',
    },
    storyList: {
        display: 'flex',
        flexDirection: 'column',
    },
    storyCard: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px 0',
    },
    media: {
        maxWidth: '100%',
        height: 'auto',
    },
};

export default BookmarkPage;
