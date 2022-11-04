const Sequelize = require("sequelize");
require("dotenv").config();

const db = new Sequelize(
  process.env.DATABASE,
  process.env.USERNAME,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    // timezone: "+09:00",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = db;
