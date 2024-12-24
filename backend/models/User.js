const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  //likedStories: [
 //   {
   //   type: mongoose.Schema.Types.ObjectId,
  //    ref: 'Story',
  //  },
  //],
  // bookmarks: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Story',
  //   },
  // ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
