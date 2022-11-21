const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register)
    .post('/login', login)
    .get('/logout', logout)
    .get('/me', protect, getMe)
    .put('/update-details', protect, updateDetails)
    .post('/update-password', protect, updatePassword)
    .post('/forgot-password', forgotPassword)
    .put('/reset-password/:resetToken', resetPassword);

module.exports = router;