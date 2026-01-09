const express = require('express');
const router = express.Router();
const Student = require('./Student');

router.get(['/signup', '/signup.ejs'], (req, res) => {
  res.render('signup', { error: null });
});

router.get('/adminlogin', (req, res) => {
  res.render('adminlogin', { error: null });
});

router.get('/studentlogin', (req, res) => {
  res.render('studentlogin', { error: null });
});

router.get('/studentdata', async (req, res) => {
  try {
    const students = await Student.find();
    res.render('studentdata', { students });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/signup', async (req, res) => {
  try {
    const {
      fullName, email, password, phoneNumber, educationStage,
      classGrade, parentEmail,
      sscPart, secondaryGroup, scienceOptionalSubject,
      hscPart, hscGroup,
      universityProgram, previousQualification
    } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !educationStage) {
      return res.render('signup', { error: 'Please fill in all required fields.' });
    }

    if (educationStage === 'Primary' || educationStage === 'Elementary') {
      if (!parentEmail) return res.render('signup', { error: 'Parent Email is required for Primary/Elementary.' });
    }

    if (educationStage === 'Secondary') {
      if (secondaryGroup === 'Science' && !scienceOptionalSubject) {
        return res.render('signup', { error: 'Please choose Computer Science or Biology for Science Group.' });
      }
    }

    if (educationStage === 'University') {
      if (!universityProgram || !previousQualification) {
        return res.render('signup', { error: 'Program and Previous Qualification required.' });
      }

      const program = universityProgram.toLowerCase();
      const prev = previousQualification.toLowerCase();

      if (program.includes('veterinary') || program.includes('dvm')) {
        if (!prev.includes('pre-medical')) return res.render('signup', { error: 'DVM is only for Pre-Medical students.' });
      }
      
      if (program.includes('urban planning')) {
        if (!prev.includes('pre-engineering')) return res.render('signup', { error: 'Urban Planning is only for Pre-Engineering students.' });
      }

      if (program.includes('accounting') && program.includes('finance')) {
        if (!prev.includes('ics') && !prev.includes('intermediate computer science')) {
           return res.render('signup', { error: 'BS Accounting & Finance is only for ICS students.' });
        }
      }

      if (program.includes('hrm') || program.includes('human resource')) {
        if (!prev.includes('commerce') && !prev.includes('i.com')) {
           return res.render('signup', { error: 'BS HRM is only for Commerce students.' });
        }
      }

      if (program === 'llb' || program.includes('law')) {
      }
    }

    const userExists = await Student.findOne({ email });
    if (userExists) {
      return res.render('signup', { error: 'User already exists with this email.' });
    }

    const student = await Student.create(req.body);

    res.redirect('/studentlogin');

  } catch (error) {
    res.render('signup', { error: error.message });
  }
});

const handleLogin = async (req, res, requiredRole) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });

    if (student && student.password === password) {
      if (student.role !== requiredRole) {
        const view = requiredRole === 'admin' ? 'adminlogin' : 'studentlogin';
        return res.render(view, { error: `Access Denied: You are not an ${requiredRole}` });
      }

      req.session.userId = student._id;
      req.session.role = student.role;

      if (requiredRole === 'admin') {
        res.redirect('/studentdata');
      } else {
        res.redirect(`/profile/${student._id}`);
      }
    } else {
      const view = requiredRole === 'admin' ? 'adminlogin' : 'studentlogin';
      res.render(view, { error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

router.post('/adminlogin', async (req, res) => {
  await handleLogin(req, res, 'admin');
});

router.post('/studentlogin', async (req, res) => {
  await handleLogin(req, res, 'student');
});

router.get('/profile/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (student) {
      await student.deleteOne();
      res.redirect('/studentdata');
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;