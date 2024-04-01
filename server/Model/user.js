const Sequelize = require("sequelize");
const sequelize = require("../Middleware/database");

const User = sequelize.define(
  "User",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    favoriteCoins: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: "[]",
      get() {
        const value = this.getDataValue("favoriteCoins");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("favoriteCoins", JSON.stringify(value));
      },
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = User;
