const express = require('express');
const { Payment, Booking, User } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-intent', authMiddleware, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // TODO: Implement Stripe payment intent creation
    res.json({
      success: true,
      data: {
        clientSecret: 'pi_test_client_secret',
        paymentIntentId: 'pi_test_payment_intent_id',
      },
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
    });
  }
});

// Confirm payment
router.post('/confirm', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // TODO: Implement Stripe payment confirmation
    res.json({
      success: true,
      message: 'Payment confirmed successfully',
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment',
    });
  }
});

// Get payment status
router.get('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Booking,
          as: 'booking',
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status',
    });
  }
});

// Refund payment
router.post('/:id/refund', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    // TODO: Implement Stripe refund logic
    res.json({
      success: true,
      message: 'Refund processed successfully',
    });
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process refund',
    });
  }
});

// Get user payment methods
router.get('/payment-methods', authMiddleware, async (req, res) => {
  try {
    // TODO: Implement get payment methods from Stripe
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment methods',
    });
  }
});

// Add payment method
router.post('/payment-methods', authMiddleware, async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    // TODO: Implement add payment method to Stripe
    res.json({
      success: true,
      message: 'Payment method added successfully',
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add payment method',
    });
  }
});

// Delete payment method
router.delete('/payment-methods/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implement delete payment method from Stripe
    res.json({
      success: true,
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete payment method',
    });
  }
});

module.exports = router;
