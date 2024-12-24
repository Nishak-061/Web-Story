const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const Bookmark = require('../models/Bookmark'); 
const { protect } = require('../middleware/authMiddleware');

// Add or remove bookmark
router.post('/bookmark', protect, async (req, res) => {
  // const { storyId } = req.body;
  // const userId = req.user.id; // Get the userId from the request object
  const { userId, storyId } = req.body; // Ensure both are included

  // Validate input
  if (!storyId) {
    return res.status(400).json({ message: 'storyId is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the story exists
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({ user: userId, story: storyId });
    
    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      res.status(200).json({ message: 'Bookmark removed' });
    } else {
      // Add bookmark
      const newBookmark = new Bookmark({ user: userId, story: storyId });
      await newBookmark.save();
      res.status(201).json({ message: 'Bookmark added' });
    }
  } catch (error) {
    console.error('Error bookmarking story:', error); 
    res.status(500).json({ message: 'Error bookmarking story', error });
  }
});

// Get bookmarks for the authenticated user
router.get('/', protect, async (req, res) => {
  const userId = req.user.id; // Get userId from the authenticated user
  console.log('Fetching bookmarks for user:', userId);
  try {
    //const bookmarks = await Bookmark.find({ user: userId }).populate('story');
    //const bookmarks = await Bookmark.find({ user: userId }).populate('story', 'title description mediaUrl');
    const bookmarks = await Bookmark.find({ user: req.user._id })
    .populate('story');
    
    console.log('Fetched bookmarks:', bookmarks);
    console.log('Bookmarks after populate:', JSON.stringify(bookmarks, null, 2));

    res.status(200).json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Error fetching bookmarks', error });
  }
});

// Check if a story is bookmarked by the user
router.get('/check', protect, async (req, res) => {
  const storyId = req.query.storyId; // Get storyId from query parameters
  const userId = req.user.id; // Get userId from the authenticated user
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isBookmarked = await Bookmark.exists({ user: userId, story: storyId });
    res.status(200).json({ isBookmarked: !!isBookmarked });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    res.status(500).json({ message: 'Error checking bookmark', error });
  }
});

module.exports = router;










// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Story = require('../models/Story');
// const Bookmark = require('../models/Bookmark'); // Import the Bookmark model
// const { protect } = require('../middleware/authMiddleware');

// // Add or remove bookmark
// router.post('/bookmark', async (req, res) => {
//   console.log('POST /bookmarks/bookmark', req.body);
//   //const { userId, storyId } = req.body;
//   const userId = req.user.id; // Get the userId from the request object
//   const { storyId } = req.body;

//   // Validate input
//   if (!userId || !storyId) {
//     return res.status(400).json({ message: 'userId and storyId are required' });
//   }

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Check if the bookmark already exists
//     const existingBookmark = await Bookmark.findOne({ user: userId, story: storyId });
    
//     if (existingBookmark) {
//       // Remove bookmark
//       await Bookmark.deleteOne({ _id: existingBookmark._id });
//       res.status(200).json({ message: 'Bookmark removed' });
//     } else {
//       // Add bookmark
//       const newBookmark = new Bookmark({ user: userId, story: storyId });
//       await newBookmark.save();
//       res.status(200).json({ message: 'Bookmark added' });
//     }
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({ message: 'Error bookmarking story', error });
//   }
// });

// // Get bookmarks
// // router.get('/bookmarks', async (req, res) => {
// //   try {
// //     const userId = req.user.id; // Ensure you get userId correctly from token or middleware
// //     const bookmarks = await Bookmark.find({ user: userId }).populate('story'); // Populate if you want story details
// //     res.status(200).json(bookmarks);
// //   } catch (error) {
// //     console.error(error); // Log the error for debugging
// //     res.status(500).json({ message: 'Error fetching bookmarks', error });
// //   }
// // });

// // Check if a story is bookmarked by the user
// router.get('/', protect, async (req, res) => {
//   const userId = req.userId; // Assume you get userId from authentication middleware
//   console.log('Fetching bookmarks for user:', userId);
//   try {
//     const bookmarks = await Bookmark.find({ user: userId }).populate('story'); // Populate with Story details
//     console.log('Fetched bookmarks:', bookmarks); // Check what bookmarks are retrieved
//     res.status(200).json(bookmarks);
//   } catch (error) {
//     console.error('Error fetching bookmarks:', error); // Log the error for debugging
//     res.status(500).json({ message: 'Error fetching bookmarks', error });
//   }
// });


// router.get('/check', async (req, res) => {
//   const { userId, storyId } = req.query;
//   try {
//       const user = await User.findById(userId);
//       if (!user) return res.status(404).json({ message: 'User not found' });
      
//       const isBookmarked = user.bookmarks.includes(storyId);
//       res.status(200).json({ isBookmarked });
//   } catch (error) {
//       res.status(500).json({ message: 'Error checking bookmark', error });
//   }
// });


// module.exports = router;

