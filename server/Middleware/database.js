const Sequelize = require("sequelize");

const dbPassword = require("./dataBasePassword");

const sequelize = new Sequelize("crypto", "root", dbPassword, {
  dialect: "mysql",
});

module.exports = sequelize;
