const express = require('express');
const { Review, Booking, User, ParkingSpace } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get space reviews
router.get('/space/:spaceId', async (req, res) => {
  try {
    const { spaceId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.findAndCountAll({
      where: {
        spaceId,
        isPublic: true,
      },
      include: [
        {
          model: User,
          as: 'reviewer',
          attributes: ['id', 'firstName', 'lastName', 'profilePicture'],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        data: reviews.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: reviews.count,
          totalPages: Math.ceil(reviews.count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get space reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reviews',
    });
  }
});

// Create review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      bookingId,
      revieweeId,
      spaceId,
      rating,
      comment,
      reviewType,
    } = req.body;

    // Validate booking exists and user has access
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: ParkingSpace,
          as: 'space',
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user has access to review this booking
    if (booking.renterId !== req.user.userId && booking.space.hostId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to review this booking',
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Can only review completed bookings',
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      where: {
        bookingId,
        reviewerId: req.user.userId,
        reviewType,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'Review already exists for this booking',
      });
    }

    const review = await Review.create({
      bookingId,
      reviewerId: req.user.userId,
      revieweeId,
      spaceId,
      rating,
      comment,
      reviewType,
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create review',
    });
  }
});

// Update review
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    // Check if user owns this review
    if (review.reviewerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review',
      });
    }

    await review.update({
      rating,
      comment,
    });

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review',
    });
  }
});

// Delete review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found',
      });
    }

    // Check if user owns this review
    if (review.reviewerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review',
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
    });
  }
});

module.exports = router;
