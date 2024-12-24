import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StoryCard from './StoryCard';
import AddStory from './AddStory';

const Stories = ({ loggedInUserId }) => { // Accept loggedInUserId as a prop
    const [stories, setStories] = useState([]);
    const [editingStory, setEditingStory] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const categories = ['food', 'health and fitness', 'travel', 'movie', 'books'];
    const [showMore, setShowMore] = useState(false);

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

    const handleEditClick = (story) => {
        setEditingStory(story);
    };

    const handleCloseDialog = () => {
        setEditingStory(null);
    };

    // Separate the logged-in user's stories and others
    const userStories = stories.filter(story => story.user === loggedInUserId);
    const otherStories = stories.filter(story => story.user !== loggedInUserId);

    // Combine user stories first, followed by other stories
    const combinedStories = [...userStories, ...otherStories];

    const filteredStories = selectedCategory
        ? combinedStories.filter(story => story.category === selectedCategory)
        : combinedStories;

    const visibleStories = showMore ? filteredStories : filteredStories.slice(0, 4);

    return (
        <>
            <h2 style={styles.categoryTitle}>Categories</h2>
            <div style={styles.categoriesRow}>
                <button
                    style={{
                        ...styles.categoryButton,
                        border: selectedCategory === '' ? '5px solid #00ACD2' : 'none',
                    }}
                    onClick={() => setSelectedCategory('')}
                >
                    All
                </button>
                {categories.map(category => (
                    <button
                        key={category}
                        style={{
                            ...styles.categoryButton,
                            border: selectedCategory === category ? '5px solid #00ACD2' : 'none',
                        }}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            <h1>Top Stories about {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'All'}</h1>
            <div style={styles.container}>
                {visibleStories.map((story) => (
                    <StoryCard
                        key={story._id}
                        storyId={story._id}
                        title={story.title}
                        description={story.description}
                        mediaUrl={story.slides[0].mediaUrl}
                        slides={story.slides}
                        onEdit={story.user === loggedInUserId ? () => handleEditClick(story) : null} // Edit only for the logged-in user
                    />
                ))}
            </div>

            {filteredStories.length > 4 && !showMore && ( // Show "See More" button if there are more than 4 stories
                <button style={styles.seeMoreButton} onClick={() => setShowMore(true)}>
                    See More
                </button>
            )}

            {editingStory && (
                <AddStory
                    onClose={handleCloseDialog}
                    existingStory={editingStory}
                    fetchStories={fetchStories}
                />
            )}
        </>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    categoryTitle: {
        marginBottom: '10px',
        fontSize: '1.5rem',
    },
    categoriesRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        marginBottom: '20px',
    },
    categoryButton: {
        width: '235px',
        height: '235px',
        borderRadius: '36px',
        backgroundColor: '#f0f0f0',
        transition: 'background-color 0.3s',
        textAlign: 'center',
        padding: '20px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    seeMoreButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#00ACD2',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
};

export default Stories;

