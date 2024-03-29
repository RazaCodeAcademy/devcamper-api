const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");

// @desc Get reviews
// @route Get /api/v1/reviews
// @route Get /api/v1/bootcamps/:bootcampId/reviews
// @access public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    var reviews = await Review.find({
      bootcamp: req.params.bootcampId,
    }).populate("user");

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single review
// @route Get /api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Get user reviews
// @route Get /api/v1/reviews/:userId
// @access Private
exports.getUserReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ user: req.user.id }).populate('bootcamp');

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
});

// @desc Add review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No Bootcamp found with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Update review
// @route PUT /api/v1/reviews/:id
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  // make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 404));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Delete review
// @route DELETE /api/v1/reviews/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  // make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to delete review`, 404));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
