const express = require('express');
const Like = require('../models/Like');
const Story = require('../models/Story');
const router = express.Router();

// Route to like or unlike a slide in a story
router.post('/like', async (req, res) => {
    const { userId, storyId, slideId } = req.body;

    try {
        // Check if the like already exists for this slide
        const existingLike = await Like.findOne({ user: userId, story: storyId, slide: slideId });
        if (existingLike) {
            // If it exists, remove the like (unlike)
            await Like.deleteOne({ _id: existingLike._id });
            console.log(`User ${userId} unliked slide with ID: ${slideId}`);
            return res.status(200).json({
                liked: false,
                likes: await Like.countDocuments({ slide: slideId })  // Total likes for this slide
            });
        } else {
            // If it does not exist, create a new like
            const newLike = new Like({ user: userId, story: storyId, slide: slideId });
            await newLike.save();
            console.log(`User ${userId} liked slide with ID: ${slideId}`);
            return res.status(201).json({
                liked: true,
                likes: await Like.countDocuments({ slide: slideId })  // Total likes for this slide
            });
        }
    } catch (error) {
        console.error('Error liking slide:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/stories/:storyId/likes
router.get('/:storyId/likes', async (req, res) => {
    const { storyId } = req.params;
    const { userId } = req.query;  // Assuming the frontend sends userId in query params

    try {
        // Fetch all likes for the story
        const likes = await Like.find({ story: storyId });

        // Filter likes by user to find which slides the user liked
        const likedSlides = likes
            .filter(like => like.user.toString() === userId)
            .map(like => like.slide.toString());  // Get array of slideIds liked by the user

        // Calculate the total like counts per slide
        const likeCounts = {};
        likes.forEach(like => {
            const slideId = like.slide.toString();
            if (!likeCounts[slideId]) likeCounts[slideId] = 0;
            likeCounts[slideId]++;
        });

        return res.status(200).json({ likedSlides, likeCounts });
    } catch (error) {
        console.error('Error fetching like status:', error);
        return res.status(500).json({ message: 'Error fetching like status', error });
    }
});

module.exports = router;



// const express = require('express');
// const Like = require('../models/Like'); // Adjust the path as needed
// const Story = require('../models/Story'); // Adjust the path as needed
// const router = express.Router();

// // Route to like a story
// router.post('/stories/like', async (req, res) => {
//     const { userId, storyId, slideId } = req.body;

//     try {
//         // Check if the like already exists for this slide
//         const existingLike = await Like.findOne({ user: userId, story: storyId, slide: slideId });
//         if (existingLike) {
//             // If it exists, remove the like
//             await Like.deleteOne({ _id: existingLike._id });
//             console.log(`User ${userId} unliked slide with ID: ${slideId}`);
//             return res.status(200).json({ liked: false, likes: await Like.countDocuments({ slide: slideId }) });
//         } else {
//             // If it does not exist, create a new like
//             const newLike = new Like({ user: userId, story: storyId, slide: slideId });
//             await newLike.save();
//             console.log(`User ${userId} liked slide with ID: ${slideId}`);
//             return res.status(201).json({ liked: true, likes: await Like.countDocuments({ slide: slideId }) });
//         }
//     } catch (error) {
//         console.error('Error liking slide:', error);
//         return res.status(500).json({ message: 'Server error' });
//     }
// });

// // GET /api/stories/:storyId/likes
// router.get('/:storyId/likes', async (req, res) => {
//     const { storyId } = req.params;
//     const { userId } = req.query; // Optional: pass userId if you want to check user-specific likes

//     try {
//         // Fetch the story and likes based on storyId
//         const likes = await Like.find({ story: storyId });

//         // Optionally filter likes by user if userId is passed
//         const userLikes = userId ? likes.filter(like => like.user.toString() === userId) : [];

//         // Get the total number of likes and which slides are liked by the user
//         const likedSlides = likes.map(like => ({
//             slideId: like.slide, // Example field, depends on your schema
//             user: like.user,     // Example: check if the user has liked
//         }));

//         const likeCounts = {}; // Store like counts per slide
//         likes.forEach(like => {
//             if (!likeCounts[like.slide]) likeCounts[like.slide] = 0;
//             likeCounts[like.slide]++;
//         });

//         res.status(200).json({ likedSlides, likeCounts });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching like status', error });
//     }
// });

// module.exports = router;
// module.exports = router;
