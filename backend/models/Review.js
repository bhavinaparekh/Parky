const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'booking_id',
      references: {
        model: 'bookings',
        key: 'id',
      },
    },
    reviewerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reviewer_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    revieweeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'reviewee_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    spaceId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'space_id',
      references: {
        model: 'parking_spaces',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewType: {
      type: DataTypes.ENUM('host_to_renter', 'renter_to_host', 'renter_to_space'),
      allowNull: false,
      field: 'review_type',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_public',
    },
  }, {
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Review.associate = (models) => {
    // Review belongs to a booking
    Review.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });

    // Review belongs to a reviewer (user who wrote the review)
    Review.belongsTo(models.User, {
      foreignKey: 'reviewerId',
      as: 'reviewer',
    });

    // Review belongs to a reviewee (user being reviewed)
    Review.belongsTo(models.User, {
      foreignKey: 'revieweeId',
      as: 'reviewee',
    });

    // Review can belong to a space (for space reviews)
    Review.belongsTo(models.ParkingSpace, {
      foreignKey: 'spaceId',
      as: 'space',
    });
  };

  return Review;
};
