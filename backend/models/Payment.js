const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payment = sequelize.define('Payment', {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    paymentIntentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'payment_intent_id',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.CHAR(3),
      defaultValue: 'USD',
    },
    paymentMethod: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'payment_method',
    },
    status: {
      type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'cancelled', 'refunded'),
      defaultValue: 'pending',
    },
    stripeChargeId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'stripe_charge_id',
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'refund_amount',
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'processed_at',
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'failure_reason',
    },
  }, {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Payment.associate = (models) => {
    // Payment belongs to a booking
    Payment.belongsTo(models.Booking, {
      foreignKey: 'bookingId',
      as: 'booking',
    });

    // Payment belongs to a user
    Payment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Payment;
};
