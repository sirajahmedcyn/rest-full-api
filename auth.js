const express = require('express');
const router = express.Router();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const Category = require('./models/Category');
const Comment = require('./models/Comment');

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admin privileges required.');
  }
  next();
};

// GET / - Home page with blog posts
router.get('/', async (req, res) => {
  try {
    const Post = require('./models/Post');
    const posts = await Post.find()
      .populate('author', 'username avatar')
      .populate('category', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    res.render('index', { posts, user: req.session.userId || null });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET /signup - Signup page
router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

// GET /login - Login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// GET /logout - Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// POST /signup - User registration
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('signup', { error: 'Username and password are required.' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.render('signup', { error: 'Username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPassword
    });

    res.redirect('/login');
  } catch (error) {
    res.render('signup', { error: error.message });
  }
});

// POST /login - User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    req.session.userId = user._id;
    req.session.role = user.role;

    res.redirect('/dashboard');
  } catch (error) {
    res.render('login', { error: error.message });
  }
});

// GET /dashboard - User dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const Post = require('./models/Post');
    const posts = await Post.find({ author: req.session.userId })
      .populate('category', 'name')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });
    const categories = await Category.find();
    res.render('dashboard', { posts, categories });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET /post/:id - View single post
router.get('/post/:id', async (req, res) => {
  try {
    const Post = require('./models/Post');
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatar')
      .populate('category', 'name')
      .populate('tags', 'name');
    
    if (!post) {
      return res.status(404).send('Post not found');
    }

    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.render('post', { post, comments, user: req.session.userId || null });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
