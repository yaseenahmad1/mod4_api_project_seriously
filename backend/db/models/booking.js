'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      }); 
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      }); 
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      // validate: {
      //   isDate: true,
      //   // customValidator(value) { 
      //   //   // if (this.endDate && value >= this.endDate) {
      //   //   //   throw new Error("Start date must be before end date ")
      //   //   // }
      //   }
      // }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      // validate: {
      //   isDate: true,
      //   // isAfter: startDate
      // }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};