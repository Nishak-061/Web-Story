const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
    slide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slide', // Optional: If you want to like specific slides
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  
const Like = mongoose.model('Like', likeSchema);
module.exports = Like; // Ensure this line is present