const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    renterId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'renter_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    spaceId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'space_id',
      references: {
        model: 'parking_spaces',
        key: 'id',
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_time',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
    },
    platformFee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'platform_fee',
    },
    hostPayout: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'host_payout',
    },
    vehicleInfo: {
      type: DataTypes.JSON,
      allowNull: false,
      field: 'vehicle_info',
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancellation_reason',
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'special_requests',
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'check_in_time',
    },
    checkOutTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'check_out_time',
    },
  }, {
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Booking.associate = (models) => {
    // Booking belongs to a renter
    Booking.belongsTo(models.User, {
      foreignKey: 'renterId',
      as: 'renter',
    });

    // Booking belongs to a parking space
    Booking.belongsTo(models.ParkingSpace, {
      foreignKey: 'spaceId',
      as: 'space',
    });

    // Booking has one payment
    Booking.hasOne(models.Payment, {
      foreignKey: 'bookingId',
      as: 'payment',
    });

    // Booking can have reviews
    Booking.hasMany(models.Review, {
      foreignKey: 'bookingId',
      as: 'reviews',
    });
  };

  return Booking;
};
