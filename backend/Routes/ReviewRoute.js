const express = require('express');
const { addReview, getReviewsByMovieId, deleteReview } = require('../Controllers/userController');
const { protect } = require('../Middlewares/jwtmiddleware');
const router = express.Router();


router.post('/addreview', protect, addReview);
router.get('/movie/:movieId', getReviewsByMovieId);
router.delete('/:movieId/reviews/:reviewId',protect,deleteReview);


module.exports = router;