const Sequelize = require("sequelize");
const dbConfig = require("../db/db-config");

const User = dbConfig.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "users",
  }
);

module.exports = User;
