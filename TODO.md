# Blog API Transformation Plan

## Phase 1: Remove Student-Related Files
- [ ] Remove models/Student.js
- [ ] Remove models/SerialKey.js
- [ ] Remove routes/studentRoutes.js
- [ ] Remove views/studentdata.ejs
- [ ] Remove views/signupadmin.ejs
- [ ] Remove views/adminsignup.ejs
- [ ] Remove views/adminlogin.ejs
- [ ] Remove views/auditadmin.ejs
- [ ] Remove views/auditdashboard.ejs
- [ ] Remove views/studentlogin.ejs
- [ ] Remove views/signup.ejs
- [ ] Remove views/studentdashborad.js
- [ ] Remove createStudent.js

## Phase 2: Create New Models
- [ ] Create models/User.js (only username, password, role)
- [ ] Create models/Post.js (title, content, author, category, image, createdAt)
- [ ] Create models/Comment.js (content, author, post, createdAt)
- [ ] Create models/Category.js (name, description)

## Phase 3: Update Authentication
- [ ] Update auth.js to use User model instead of Student
- [ ] Modify signup/login to only require username and password
- [ ] Remove admin/audit admin logic
- [ ] Update session handling for blog users

## Phase 4: Create Blog Routes
- [ ] Create routes/blogRoutes.js with RESTful endpoints:
  - GET /api/posts - Get all posts
  - POST /api/posts - Create post
  - GET /api/posts/:id - Get single post
  - PUT /api/posts/:id - Update post
  - DELETE /api/posts/:id - Delete post
  - POST /api/posts/:id/comments - Add comment
  - GET /api/categories - Get categories
  - POST /api/categories - Create category
  - POST /api/upload - Upload image

## Phase 5: Update Views
- [ ] Create new signup.ejs (only username, password)
- [ ] Create new login.ejs (only username, password)
- [ ] Update index.ejs to show blog posts with default.png if no image
- [ ] Create dashboard.ejs for user posts/comments
- [ ] Update menu links to blog features

## Phase 6: Update Main Files
- [ ] Update index.js to use new routes
- [ ] Update server.js if needed
- [ ] Add multer for file uploads
- [ ] Update package.json dependencies if needed

## Phase 7: Testing
- [ ] Test signup/login with username only
- [ ] Test creating posts with categories and images
- [ ] Test comments and delete functionality
- [ ] Test RESTful API endpoints
