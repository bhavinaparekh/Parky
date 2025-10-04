const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AvailabilitySchedule = sequelize.define('AvailabilitySchedule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'day_of_week',
      validate: {
        min: 0,
        max: 6,
      },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'end_time',
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_available',
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_recurring',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'end_date',
    },
  }, {
    tableName: 'availability_schedules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  AvailabilitySchedule.associate = (models) => {
    // Availability schedule belongs to a parking space
    AvailabilitySchedule.belongsTo(models.ParkingSpace, {
      foreignKey: 'spaceId',
      as: 'space',
    });
  };

  return AvailabilitySchedule;
};
