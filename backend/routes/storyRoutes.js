const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const authenticateToken = require('../middleware/authMiddleware');

// Create a new story
router.post('/', async (req, res) => {
  const { title, description,  category, slides } = req.body;

  // Validate fields
  // if (!title || !description || !mediaUrl || !category) {
  //   return res.status(400).json({ message: 'All fields are required' });
  // }
  if (!title || !description || !category || !slides || !Array.isArray(slides) || slides.length === 0) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  for (const slide of slides) {
    if (!slide.title || !slide.description || !slide.mediaUrl || !slide.category) {
      return res.status(400).json({ message: 'All fields in each slide are required' });
    }
  }
  

  try {
    // Create a new story instance and save it to the database
    const newStory = new Story({
      title,
      description,
      //slides: [mediaUrl], // Assuming mediaUrl is a string, you can extend this logic for multiple slides
      slides,
      category,
    });
    console.log('Story to be saved:', newStory); // Log the story object before saving
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    console.error("Detailed error:", error); // Log the exact error
    res.status(500).json({ message: 'Server error, could not create story' });
  }
});

// Get all stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories' });
  }
});


module.exports = router;

// Update an existing story
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { slides } = req.body;

//   // Validate the required fields for each slide
//   if (!slides || !Array.isArray(slides) || slides.length === 0) {
//     return res.status(400).json({ message: 'Slides are required' });
//   }

//   for (const slide of slides) {
//     if (!slide.title || !slide.description || !slide.mediaUrl || !slide.category) {
//       return res.status(400).json({ message: 'All fields in each slide are required' });
//     }
//   }

//   try {
//     // Update the story by its ID
//     const updatedStory = await Story.findByIdAndUpdate(id, { slides }, { new: true });
    
//     if (!updatedStory) {
//       return res.status(404).json({ message: 'Story not found' });
//     }

//     res.status(200).json(updatedStory);
//   } catch (error) {
//     console.error('Error updating story:', error);
//     res.status(500).json({ message: 'Server error, could not update story' });
//   }
// });

// Update an existing story by ID
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const trimmedId = id.trim(); // Trim whitespace/newline characters
//   const { title, description, category, slides } = req.body;

//   try {
//     // Find the existing story and update it
//     const updatedStory = await Story.findByIdAndUpdate(
//       //id, 
//       trimmedId,
//       { title, description, category, slides }, // New data to update
//       { new: true } // Return the updated story
//     );

//     if (!updatedStory) {
//       return res.status(404).json({ message: 'Story not found' });
//     }

//     res.status(200).json(updatedStory);
//   } catch (error) {
//     console.error('Error updating story:', error);
//     res.status(500).json({ message: 'Server error, could not update story' });
//   }
// });


// Update an existing story by ID

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const trimmedId = id.trim(); // Trim whitespace/newline characters
  const { title, description, category, slides } = req.body;

  try {
    // Fetch the existing story first
    const existingStory = await Story.findById(trimmedId);
    if (!existingStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Validate each slide
    if (slides && Array.isArray(slides)) {
      for (const slide of slides) {
        // Check if the slide has all required fields only if they are being updated
        if (
          (slide.hasOwnProperty('title') && !slide.title) ||
          (slide.hasOwnProperty('description') && !slide.description) ||
          (slide.hasOwnProperty('mediaUrl') && !slide.mediaUrl) ||
          (slide.hasOwnProperty('category') && !slide.category)
        ) {
          return res.status(400).json({ message: 'All fields in each updated slide are required' });
        }
      }
    }

    // Merge existing story data with the updated data
    const updatedData = {
      title: title || existingStory.title,
      description: description || existingStory.description,
      category: category || existingStory.category,
      slides: slides || existingStory.slides // Update slides only if provided
    };

    // Update the story in the database
    const updatedStory = await Story.findByIdAndUpdate(
      trimmedId,
      updatedData,
      { new: true } // Return the updated story
    );

    res.status(200).json(updatedStory);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Server error, could not update story' });
  }
});

// Public route to fetch a story
router.get('/public/:storyId', async (req, res) => {
  try {
      const story = await Story.findById(req.params.storyId).populate('slides');
      if (!story) {
          return res.status(404).json({ message: 'Story not found' });
      }
      res.status(200).json(story);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching story', error });
  }
});


// Like or Unlike a story

// POST request to like/unlike a story
router.post('/:storyId/like', async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id; // Assuming user is authenticated

  try {
    const story = await Story.findById(storyId);
    if (!story) return res.status(404).json({ message: 'Story not found' });

    const liked = story.likes.includes(userId);
    if (liked) {
      // Unlike the story
      story.likes = story.likes.filter(id => id.toString() !== userId);
    } else {
      // Like the story
      story.likes.push(userId);
    }

    await story.save();
    return res.json({ likes: story.likes.length, liked: !liked });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
module.exports = router;

module.exports = router;



// // In routes/stories.js
// router.post('/:id/likes', async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user._id; // Assuming you have a middleware that adds user info

//   try {
//       const story = await Story.findById(id);
//       if (!story) {
//           return res.status(404).json({ message: 'Story not found' });
//       }

//       if (!story.likes.includes(userId)) {
//           story.likes.push(userId);
//           await story.save();
//           return res.status(200).json({ message: 'Liked story successfully' });
//       } else {
//           return res.status(400).json({ message: 'Already liked' });
//       }
//   } catch (error) {
//       console.error('Error liking story:', error);
//       res.status(500).json({ message: 'Server error' });
//   }
// });

// // In routes/slides.js (or wherever you're handling slides)
// router.post('/:slideId/likes', async (req, res) => {
//   const { slideId } = req.params;

//   // Log the request details
//   console.log('Incoming request to like slide:', slideId);

//   // Check if req.user is set
//   if (!req.user || !req.user._id) {
//       console.error('User is not authenticated or user ID is missing.');
//       return res.status(401).json({ message: 'Unauthorized' });
//   }
//   const userId = req.user._id; 

//   try {
//       const story = await Story.findOne({ 'slides._id': slideId });
//       if (!story) {
//           console.error('Story not found for slide ID:', slideId);
//           return res.status(404).json({ message: 'Slide not found' });
//       }

//       const slide = story.slides.id(slideId);
//       if (!slide) {
//           console.error('Slide not found:', slideId);
//           return res.status(404).json({ message: 'Slide not found' });
//       }

//       console.log('Slide found:', slide);

//       if (!slide.likes.includes(userId)) {
//           slide.likes.push(userId);
//           await story.save();
//           return res.status(200).json({ message: 'Liked slide successfully' });
//       } else {
//           return res.status(400).json({ message: 'Already liked' });
//       }
//   } catch (error) {
//       console.error('Error liking slide:', error);
//       res.status(500).json({ message: 'Server error' });
//   }
// });
