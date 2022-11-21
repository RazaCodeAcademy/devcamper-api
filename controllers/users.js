const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User.js');

// @desc Get all users
// @route Get /api/v1/auth/users
// @access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc Get single users
// @route Get /api/v1/auth/users/:id
// @access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user  = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc Create user
// @route Post /api/v1/auth/users
// @access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user  = await User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

// @desc Update user
// @route PUT /api/v1/auth/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user  = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 400));
    }

    user = await User.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc Delete user
// @route DELETE /api/v1/auth/users/:id
// @access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user  = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 400));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});