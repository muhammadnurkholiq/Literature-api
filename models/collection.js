"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      collection.belongsTo(models.literature, {
        as: "literature",
        foreignKey: {
          name: "literatureId",
        },
      });

      collection.belongsTo(models.user, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  collection.init(
    {
      userId: DataTypes.INTEGER,
      literatureId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "collection",
    }
  );
  return collection;
};
