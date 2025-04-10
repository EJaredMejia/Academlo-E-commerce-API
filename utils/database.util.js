const { DataTypes } = require("sequelize");
const { getSequelize } = require("./sequelize.utils");

let sequelize = null;

function loadSequelize() {
  // Load environment variables
  const sequelize = getSequelize();

  return sequelize;
}

function getDb() {
  // re-use the sequelize instance across invocations to improve performance
  if (!sequelize) {
    sequelize = loadSequelize();
  }

  return sequelize;
}

module.exports = { getDb, DataTypes };
