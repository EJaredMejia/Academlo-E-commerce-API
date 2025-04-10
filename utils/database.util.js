const { DataTypes } = require("sequelize");
const { getSequelize } = require("./sequelize.utils");

// Establish db connection
const db = getSequelize();

module.exports = { db, DataTypes };
