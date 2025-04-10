const { DataTypes } = require("sequelize");
const { getSequelize } = require("./sequelize.utils");

let sequelize = null;

function loadSequelize() {
  const sequelize = getSequelize();

  return sequelize;
}

function getDb() {
  // re-use the sequelize instance across invocations to improve performance
  if (!sequelize) {
    sequelize = loadSequelize();
  } else {
    // restart connection pool to ensure connections are not re-used across invocations
    sequelize.connectionManager.initPools();

    // restore `getConnection()` if it has been overwritten by `close()`
    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
      delete sequelize.connectionManager.getConnection;
    }
  }

  return sequelize;
}

// Establish db connection
const db = getDb();

module.exports = { db, DataTypes };
