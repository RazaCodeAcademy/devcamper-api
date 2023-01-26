const express = require('express');
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview,
    getUserReviews
} = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(advancedResults(Review, {
        path: 'user bootcamp'
    }), getReviews)
    .post(protect, authorize('user', 'admin'), addReview);

router.route('/by-user')
    .get(protect, getUserReviews);

router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;