const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User.js');

// @desc Register user
// @route Post /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;

    // create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // create token 
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    });
});

// @desc Register user
// @route Post /api/v1/auth/register
// @access Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    // validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please aprovide an email an password'), 400);
    }

    // check for user
    const user = await User.findOne({ email: email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials'), 401);
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials'), 401);
    }

    sendTokenResponse(user, 200, res);
});

// get token from model, create cokie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create token 
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token: token
    });
}