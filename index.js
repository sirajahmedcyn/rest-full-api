const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./auth');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net"
  );
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Uploads folder
const uploadsDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Session
app.use(session({
  secret: 'a-very-secure-random-session-secret-key-1234567890',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Routes
app.use('/', authRoutes);
app.use('/api', blogRoutes);
app.use('/api', require('./api/post'));

module.exports = app;
