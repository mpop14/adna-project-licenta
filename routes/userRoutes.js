const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');

router.post('/register', (req, res, next) => {
    console.log('Hit /api/users/register');
    next();
}, registerUser);

router.post('/login', (req, res, next) => {
    console.log('Hit /api/users/login');
    next();
}, loginUser);

router.get('/profile', (req, res, next) => {
    console.log('Hit /api/users/profile');
    next();
}, getUserProfile);

module.exports = router;
