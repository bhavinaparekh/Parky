const express = require('express');
const { Booking, ParkingSpace, User, Payment } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      spaceId,
      startTime,
      endTime,
      vehicleInfo,
      specialRequests,
    } = req.body;

    // Validate space exists and is available
    const space = await ParkingSpace.findByPk(spaceId);
    if (!space || space.status !== 'active') {
      return res.status(404).json({
        success: false,
        error: 'Space not found or not available',
      });
    }

    // TODO: Check availability for the requested time period
    // TODO: Calculate pricing
    // TODO: Create payment intent

    const booking = await Booking.create({
      renterId: req.user.userId,
      spaceId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      vehicleInfo,
      specialRequests,
      totalAmount: 50.00, // TODO: Calculate actual amount
      platformFee: 5.00, // TODO: Calculate platform fee
      hostPayout: 45.00, // TODO: Calculate host payout
      status: space.instantBook ? 'confirmed' : 'pending',
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
    });
  }
});

// Get user bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type = 'upcoming' } = req.query;

    const whereClause = {
      renterId: req.user.userId,
    };

    // Filter by booking status based on type
    if (type === 'upcoming') {
      whereClause.status = ['pending', 'confirmed', 'active'];
    } else if (type === 'past') {
      whereClause.status = ['completed', 'cancelled'];
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: ParkingSpace,
          as: 'space',
          include: [
            {
              model: User,
              as: 'host',
              attributes: ['id', 'firstName', 'lastName', 'profilePicture'],
            },
          ],
        },
        {
          model: User,
          as: 'renter',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get bookings',
    });
  }
});

// Get booking by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: ParkingSpace,
          as: 'space',
          include: [
            {
              model: User,
              as: 'host',
              attributes: ['id', 'firstName', 'lastName', 'profilePicture', 'phone'],
            },
          ],
        },
        {
          model: User,
          as: 'renter',
          attributes: ['id', 'firstName', 'lastName', 'phone'],
        },
        {
          model: Payment,
          as: 'payment',
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user has access to this booking
    if (booking.renterId !== req.user.userId && booking.space.hostId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get booking details',
    });
  }
});

// Update booking
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user has access to update this booking
    if (booking.renterId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this booking',
      });
    }

    // Only allow updates for pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Cannot update booking in current status',
      });
    }

    await booking.update(updateData);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking',
    });
  }
});

// Cancel booking
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user has access to cancel this booking
    if (booking.renterId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking',
      });
    }

    // Only allow cancellation for pending or confirmed bookings
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel booking in current status',
      });
    }

    await booking.update({
      status: 'cancelled',
      cancellationReason: reason,
    });

    // TODO: Process refund if payment was made

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel booking',
    });
  }
});

// Extend booking
router.post('/:id/extend', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { newEndTime } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user has access to extend this booking
    if (booking.renterId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to extend this booking',
      });
    }

    // Only allow extension for active bookings
    if (booking.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Can only extend active bookings',
      });
    }

    // TODO: Check availability for extended time
    // TODO: Calculate additional cost

    await booking.update({
      endTime: new Date(newEndTime),
    });

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Extend booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to extend booking',
    });
  }
});

// Check in
router.post('/:id/check-in', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user has access to check in
    if (booking.renterId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to check in',
      });
    }

    // Only allow check-in for confirmed bookings
    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        error: 'Can only check in to confirmed bookings',
      });
    }

    await booking.update({
      status: 'active',
      checkInTime: new Date(),
    });

    res.json({
      success: true,
      message: 'Checked in successfully',
    });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check in',
    });
  }
});

// Check out
router.post('/:id/check-out', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user has access to check out
    if (booking.renterId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to check out',
      });
    }

    // Only allow check-out for active bookings
    if (booking.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Can only check out from active bookings',
      });
    }

    await booking.update({
      status: 'completed',
      checkOutTime: new Date(),
    });

    res.json({
      success: true,
      message: 'Checked out successfully',
    });
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check out',
    });
  }
});

// Get host bookings
router.get('/host', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: ParkingSpace,
          as: 'space',
          where: { hostId: req.user.userId },
        },
        {
          model: User,
          as: 'renter',
          attributes: ['id', 'firstName', 'lastName', 'profilePicture'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get host bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get host bookings',
    });
  }
});

// Confirm booking (host)
router.post('/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
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

    // Check if user is the host
    if (booking.space.hostId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to confirm this booking',
      });
    }

    // Only allow confirmation for pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Can only confirm pending bookings',
      });
    }

    await booking.update({ status: 'confirmed' });

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm booking',
    });
  }
});

// Decline booking (host)
router.post('/:id/decline', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findByPk(id, {
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

    // Check if user is the host
    if (booking.space.hostId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to decline this booking',
      });
    }

    // Only allow decline for pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Can only decline pending bookings',
      });
    }

    await booking.update({
      status: 'cancelled',
      cancellationReason: reason,
    });

    res.json({
      success: true,
      message: 'Booking declined successfully',
    });
  } catch (error) {
    console.error('Decline booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to decline booking',
    });
  }
});

module.exports = router;
