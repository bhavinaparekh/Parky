const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'last_name',
    },
    profilePicture: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'profile_picture',
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'date_of_birth',
    },
    verificationStatus: {
      type: DataTypes.ENUM('pending', 'verified', 'rejected'),
      defaultValue: 'pending',
      field: 'verification_status',
    },
    userType: {
      type: DataTypes.ENUM('renter', 'host', 'both'),
      defaultValue: 'renter',
      field: 'user_type',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at',
    },
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash')) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 12);
        }
      },
    },
  });

  User.prototype.validatePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.passwordHash;
    return values;
  };

  User.associate = (models) => {
    // User has many parking spaces
    User.hasMany(models.ParkingSpace, {
      foreignKey: 'hostId',
      as: 'parkingSpaces',
    });

    // User has many bookings as renter
    User.hasMany(models.Booking, {
      foreignKey: 'renterId',
      as: 'bookings',
    });

    // User has many reviews as reviewer
    User.hasMany(models.Review, {
      foreignKey: 'reviewerId',
      as: 'reviewsGiven',
    });

    // User has many reviews as reviewee
    User.hasMany(models.Review, {
      foreignKey: 'revieweeId',
      as: 'reviewsReceived',
    });

    // User has many payments
    User.hasMany(models.Payment, {
      foreignKey: 'userId',
      as: 'payments',
    });
  };

  return User;
};
