const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
const Tag = require('../models/Tag');
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

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// GET /api/posts - Get all blog posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('category', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/posts/:id - Get a single blog post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('category', 'name')
      .populate('tags', 'name');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/posts - Create a new blog post with image
router.post('/posts', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    let tagIds = [];
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim()).filter(t => t !== "");
      for (const tagName of tagList) {
        let tag = await Tag.findOne({ name: { $regex: new RegExp(`^${tagName}$`, 'i') } });
        if (!tag) {
          tag = new Tag({ name: tagName });
          await tag.save();
        }
        tagIds.push(tag._id);
      }
    }

    const postData = {
      title,
      content,
      author: req.session.userId,
      image: req.file ? `/images/${req.file.filename}` : null,
      tags: tagIds
    };

    // Handle Category (ID or Name)
    if (category && category.trim() !== "") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        postData.category = category;
      } else {
        let cat = await Category.findOne({ name: category });
        if (!cat) {
          cat = new Category({ name: category });
          await cat.save();
        }
        postData.category = cat._id;
      }
    }

    const post = new Post(postData);

    await post.save();
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/categories - Sabhi categories layein
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/categories - Nayi category banayein
router.post('/categories', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    // Simple validation
    if (!name) {
        return res.redirect('/dashboard');
    }
    const category = new Category({ name, description });
    await category.save();
    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/posts/:id/comments - Add a comment
router.post('/posts/:id/comments', requireAuth, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = new Comment({
      content,
      post: req.params.id,
      author: req.session.userId
    });
    await comment.save();
    res.redirect(`/post/${req.params.id}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST /api/posts/delete/:id - Delete a post
router.post('/posts/delete/:id', requireAuth, async (req, res) => {
  try {
    // Ensure user owns the post
    await Post.findOneAndDelete({ _id: req.params.id, author: req.session.userId });
    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET /api/posts/edit/:id - Render edit page
router.get('/posts/edit/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category')
      .populate('tags');
    
    if (!post) return res.status(404).send('Post not found');
    if (post.author.toString() !== req.session.userId) return res.status(403).send('Unauthorized');

    const categories = await Category.find();
    res.render('edit', { post, categories });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST /api/posts/edit/:id - Handle update
router.post('/posts/edit/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    // Tag logic
    let tagIds = [];
    if (tags) {
      const tagList = tags.split(',').map(t => t.trim()).filter(t => t !== "");
      for (const tagName of tagList) {
        let tag = await Tag.findOne({ name: { $regex: new RegExp(`^${tagName}$`, 'i') } });
        if (!tag) {
          tag = new Tag({ name: tagName });
          await tag.save();
        }
        tagIds.push(tag._id);
      }
    }

    const updateData = {
      title,
      content,
      tags: tagIds
    };

    // Handle Category (ID or Name)
    if (category && category.trim() !== "") {
      if (mongoose.Types.ObjectId.isValid(category)) {
        updateData.category = category;
      } else {
        let cat = await Category.findOne({ name: category });
        if (!cat) {
          cat = new Category({ name: category });
          await cat.save();
        }
        updateData.category = cat._id;
      }
    }

    if (req.file) {
      updateData.image = `/images/${req.file.filename}`;
    }

    await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.session.userId },
      updateData
    );

    res.redirect('/dashboard');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST /api/comments/delete/:id - Delete a comment
router.post('/comments/delete/:id', requireAuth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post');
    if (!comment) return res.status(404).send('Comment not found');

    // Allow comment author OR post author to delete
    const post = await Post.findById(comment.post._id);
    
    if (comment.author.toString() === req.session.userId || post.author.toString() === req.session.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.redirect(`/post/${post._id}`);
    } else {
      res.status(403).send('Unauthorized');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;