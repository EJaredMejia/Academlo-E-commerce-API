const serverless = require("serverless-http");
const { app } = require("../../app");

const { getSequelize } = require("../../utils/sequelize.utils");

let sequelize = null;

async function loadSequelize() {
  const sequelize = getSequelize({
    pool: {
      max: 2,
      min: 0,
      idle: 0,
      acquire: 3000,
    },
  });

  await sequelize.authenticate();

  return sequelize;
}

module.exports.handler = async function (event, callback) {
  // re-use the sequelize instance across invocations to improve performance
  if (!sequelize) {
    sequelize = await loadSequelize();
  } else {
    // restart connection pool to ensure connections are not re-used across invocations
    sequelize.connectionManager.initPools();

    // restore `getConnection()` if it has been overwritten by `close()`
    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
      delete sequelize.connectionManager.getConnection;
    }
  }

  try {
    return serverless(app);
  } finally {
    // close any opened connections during the invocation
    // this will wait for any in-progress queries to finish before closing the connections
    await sequelize.connectionManager.close();
  }
};
