const express = require('express');
const { User } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
    });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth } = req.body;
    
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    await user.update({
      firstName,
      lastName,
      phone,
      dateOfBirth,
    });

    res.json({
      success: true,
      data: user.toJSON(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
});

// Upload avatar
router.post('/upload-avatar', authMiddleware, async (req, res) => {
  try {
    // TODO: Implement file upload logic
    res.json({
      success: true,
      data: {
        profilePicture: 'https://example.com/avatar.jpg',
      },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload avatar',
    });
  }
});

// Get user reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement get user reviews logic
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get reviews',
    });
  }
});

// Verify identity
router.post('/verify-identity', authMiddleware, async (req, res) => {
  try {
    // TODO: Implement identity verification logic
    res.json({
      success: true,
      message: 'Identity verification submitted',
    });
  } catch (error) {
    console.error('Verify identity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit verification',
    });
  }
});

module.exports = router;
