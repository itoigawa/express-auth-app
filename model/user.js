const Sequelize = require("sequelize");
const dbConfig = require("../db/db-config");

const User = dbConfig.define(
  "User",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
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
