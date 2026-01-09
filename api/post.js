const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Middleware for authentication
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// POST /api/post - Create a new post with verification
router.post('/post', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Verification: Check if required fields are provided
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Verification: Check title length
    if (title.length < 5 || title.length > 100) {
      return res.status(400).json({ error: 'Title must be between 5 and 100 characters' });
    }

    // Verification: Check content length
    if (content.length < 10 || content.length > 5000) {
      return res.status(400).json({ error: 'Content must be between 10 and 5000 characters' });
    }

    // Verification: Check if user exists
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create the post
    const post = new Post({
      title,
      content,
      category,
      author: req.session.userId,
      image: req.file ? `/images/${req.file.filename}` : null
    });

    await post.save();

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
