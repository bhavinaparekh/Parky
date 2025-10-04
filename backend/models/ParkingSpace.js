const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ParkingSpace = sequelize.define('ParkingSpace', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hostId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'host_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    spaceType: {
      type: DataTypes.ENUM('driveway', 'garage', 'lot', 'street', 'covered'),
      allowNull: false,
      field: 'space_type',
    },
    vehicleTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'vehicle_types',
      defaultValue: [],
    },
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'hourly_rate',
    },
    dailyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'daily_rate',
    },
    weeklyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'weekly_rate',
    },
    monthlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'monthly_rate',
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    maxVehicleLength: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'max_vehicle_length',
    },
    maxVehicleWidth: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'max_vehicle_width',
    },
    maxVehicleHeight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'max_vehicle_height',
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instantBook: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'instant_book',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending_approval'),
      defaultValue: 'pending_approval',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  }, {
    tableName: 'parking_spaces',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  ParkingSpace.associate = (models) => {
    // Parking space belongs to a host
    ParkingSpace.belongsTo(models.User, {
      foreignKey: 'hostId',
      as: 'host',
    });

    // Parking space has many bookings
    ParkingSpace.hasMany(models.Booking, {
      foreignKey: 'spaceId',
      as: 'bookings',
    });

    // Parking space has many photos
    ParkingSpace.hasMany(models.SpacePhoto, {
      foreignKey: 'spaceId',
      as: 'photos',
    });

    // Parking space has many availability schedules
    ParkingSpace.hasMany(models.AvailabilitySchedule, {
      foreignKey: 'spaceId',
      as: 'availability',
    });

    // Parking space has many reviews
    ParkingSpace.hasMany(models.Review, {
      foreignKey: 'spaceId',
      as: 'reviews',
    });
  };

  return ParkingSpace;
};
