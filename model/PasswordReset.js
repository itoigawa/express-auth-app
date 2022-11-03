const Sequelize = require("sequelize");
const dbConfig = require("../db/db-config");

const PasswordReset = dbConfig.define(
  "PasswordReset",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
    },
    token: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
  },
  {
    // timestamps: false,
    tableName: "password_resets",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = PasswordReset;
