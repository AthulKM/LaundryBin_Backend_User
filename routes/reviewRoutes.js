import express from 'express';
import { createReview, getAllReviews, getReviewById, updateReview, deleteReview, getReviewsByUserId }  from '../controllers/reviewController.js';
const router = express.Router();

// Create a new review
router.post('/', createReview);

// Get all reviews
router.get('/', getAllReviews);

// Get a review by id
router.get('/:id', getReviewById);

router.get('/user-reviews/:userId', getReviewsByUserId);

// Update a review by id
router.put('/:id', updateReview);

// Delete a review by id
router.delete('/:id', deleteReview);

export default router;
