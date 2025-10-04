const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SpacePhoto = sequelize.define('SpacePhoto', {
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
    photoUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'photo_url',
    },
    caption: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'display_order',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  }, {
    tableName: 'space_photos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  SpacePhoto.associate = (models) => {
    // Space photo belongs to a parking space
    SpacePhoto.belongsTo(models.ParkingSpace, {
      foreignKey: 'spaceId',
      as: 'space',
    });
  };

  return SpacePhoto;
};
