const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { update } = require('../models/User');

router.post('/register', register)
    .post('/login', login)
    .get('/me', protect, getMe)
    .put('/update-details', protect, updateDetails)
    .post('/update-password', protect, updatePassword)
    .post('/forgot-password', forgotPassword)
    .put('/reset-password/:resetToken', resetPassword);

module.exports = router;