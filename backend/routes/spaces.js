const express = require('express');
const { ParkingSpace, User, SpacePhoto, AvailabilitySchedule } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Search spaces
router.get('/search', async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 5,
      startTime,
      endTime,
      vehicleType,
      spaceType,
      amenities,
      minPrice,
      maxPrice,
      instantBook,
      page = 1,
      limit = 20,
    } = req.query;

    // Build where clause
    const whereClause = {
      status: 'active',
      isActive: true,
    };

    if (spaceType) {
      const types = spaceType.split(',');
      whereClause.spaceType = types;
    }

    if (instantBook !== undefined) {
      whereClause.instantBook = instantBook === 'true';
    }

    if (minPrice || maxPrice) {
      whereClause.hourlyRate = {};
      if (minPrice) whereClause.hourlyRate[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.hourlyRate[Op.lte] = parseFloat(maxPrice);
    }

    // TODO: Implement location-based search with lat/lng/radius
    // TODO: Implement availability checking with startTime/endTime
    // TODO: Implement amenities filtering

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const spaces = await ParkingSpace.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'profilePicture'],
        },
        {
          model: SpacePhoto,
          as: 'photos',
          where: { isActive: true },
          required: false,
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        data: spaces.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: spaces.count,
          totalPages: Math.ceil(spaces.count / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Search spaces error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search spaces',
    });
  }
});

// Get nearby spaces
router.get('/nearby', async (req, res) => {
  try {
    // TODO: Implement nearby spaces logic based on user location
    const spaces = await ParkingSpace.findAll({
      where: {
        status: 'active',
        isActive: true,
      },
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName'],
        },
        {
          model: SpacePhoto,
          as: 'photos',
          where: { isActive: true },
          required: false,
          limit: 1,
        },
      ],
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: spaces,
    });
  } catch (error) {
    console.error('Get nearby spaces error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get nearby spaces',
    });
  }
});

// Get space by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const space = await ParkingSpace.findByPk(id, {
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'profilePicture', 'verificationStatus'],
        },
        {
          model: SpacePhoto,
          as: 'photos',
          where: { isActive: true },
          required: false,
          order: [['displayOrder', 'ASC']],
        },
        {
          model: AvailabilitySchedule,
          as: 'availability',
          required: false,
        },
      ],
    });

    if (!space) {
      return res.status(404).json({
        success: false,
        error: 'Space not found',
      });
    }

    res.json({
      success: true,
      data: space,
    });
  } catch (error) {
    console.error('Get space error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get space details',
    });
  }
});

// Create space
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      latitude,
      longitude,
      spaceType,
      vehicleTypes,
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
      amenities,
      maxVehicleLength,
      maxVehicleWidth,
      maxVehicleHeight,
      instructions,
      instantBook,
    } = req.body;

    const space = await ParkingSpace.create({
      hostId: req.user.userId,
      title,
      description,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      spaceType,
      vehicleTypes: vehicleTypes || [],
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
      dailyRate: dailyRate ? parseFloat(dailyRate) : null,
      weeklyRate: weeklyRate ? parseFloat(weeklyRate) : null,
      monthlyRate: monthlyRate ? parseFloat(monthlyRate) : null,
      amenities: amenities || [],
      maxVehicleLength: maxVehicleLength ? parseFloat(maxVehicleLength) : null,
      maxVehicleWidth: maxVehicleWidth ? parseFloat(maxVehicleWidth) : null,
      maxVehicleHeight: maxVehicleHeight ? parseFloat(maxVehicleHeight) : null,
      instructions,
      instantBook: instantBook || false,
    });

    res.status(201).json({
      success: true,
      data: space,
    });
  } catch (error) {
    console.error('Create space error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create space',
    });
  }
});

// Update space
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const space = await ParkingSpace.findByPk(id);
    if (!space) {
      return res.status(404).json({
        success: false,
        error: 'Space not found',
      });
    }

    // Check if user owns this space
    if (space.hostId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this space',
      });
    }

    await space.update(updateData);

    res.json({
      success: true,
      data: space,
    });
  } catch (error) {
    console.error('Update space error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update space',
    });
  }
});

// Delete space
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const space = await ParkingSpace.findByPk(id);
    if (!space) {
      return res.status(404).json({
        success: false,
        error: 'Space not found',
      });
    }

    // Check if user owns this space
    if (space.hostId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this space',
      });
    }

    await space.update({ isActive: false });

    res.json({
      success: true,
      message: 'Space deleted successfully',
    });
  } catch (error) {
    console.error('Delete space error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete space',
    });
  }
});

// Get user's spaces
router.get('/my-spaces', authMiddleware, async (req, res) => {
  try {
    const spaces = await ParkingSpace.findAll({
      where: {
        hostId: req.user.userId,
        isActive: true,
      },
      include: [
        {
          model: SpacePhoto,
          as: 'photos',
          where: { isActive: true },
          required: false,
          limit: 1,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: spaces,
    });
  } catch (error) {
    console.error('Get my spaces error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get spaces',
    });
  }
});

// Upload space photo
router.post('/:id/photos', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implement photo upload logic
    res.json({
      success: true,
      data: {
        photoUrl: 'https://example.com/photo.jpg',
      },
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload photo',
    });
  }
});

// Delete space photo
router.delete('/photos/:photoId', authMiddleware, async (req, res) => {
  try {
    const { photoId } = req.params;

    // TODO: Implement photo deletion logic
    res.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete photo',
    });
  }
});

// Get space availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // TODO: Implement availability checking logic
    res.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get availability',
    });
  }
});

// Update space availability
router.put('/:id/availability', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    // TODO: Implement availability update logic
    res.json({
      success: true,
      message: 'Availability updated successfully',
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update availability',
    });
  }
});

module.exports = router;
