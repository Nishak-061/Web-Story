const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Slide title is required'],
  },
  description: {
    type: String,
    required: [true, 'Slide description is required'],
  },
  mediaUrl: {
    type: String,
    required: [true, 'Slide media URL is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'health and fitness', 'travel', 'movie', 'books'], // Include your categories here
  },
  //likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User' }, // Array of user IDs who liked the slide
  //likes: { type: Number, default: 0 } 
});

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'health and fitness', 'travel', 'movie', 'books'],
  },
  slides: [slideSchema], // Use the new slideSchema here
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs who liked the story
  
  // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Assuming you reference User
  // likeCount: {
  //   type: Number,
  //   default: 0, // Store the total number of likes
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;





// const mongoose = require('mongoose');

// const storySchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Title is required'],
//   },
//   description: {
//     type: String,
//     required: [true, 'Description is required'],
//   },
//   category: {
//     type: String,
//     required: [true, 'Category is required'],
//     enum: ['food', 'health and fitness', 'travel', 'movie', 'books'],
//   },
//   slides: [
//     {
//       type: String, // URL or path to image/video file
//       required: [true, 'Slide content is required'],
//     },
//   ],
//   likes: {
//     type: Number,
//     default: 0, // Default value for likes
//   },
//   // likes: [
//   //   {
//   //     type: mongoose.Schema.Types.ObjectId,
//   //     ref: 'User',
//   //     // unique: true, // Ensure that the user can like a story only once
//   //   },
//   // ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Add custom validation for slides (3-6 mandatory)
// // storySchema.pre('validate', function (next) {
// //   if (this.slides.length < 3) {
// //     this.invalidate('slides', 'A story must have at least 3 slides');
// //   }
// //   if (this.slides.length > 6) {
// //     this.invalidate('slides', 'A story cannot have more than 6 slides');
// //   }
// //   next();
// // });

// const Story = mongoose.model('Story', storySchema);
// module.exports = Story;
