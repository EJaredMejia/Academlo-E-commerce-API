const serverless = require("serverless-http");
const { app } = require("../../app");
const { loadModels } = require("../../utils/load-models.util");
const { getDb } = require("../../utils/database.util");

module.exports.handler = async function (...args) {
  const sequelize = getDb();

  console.log(sequelize);
  if (sequelize) {
    // restart connection pool to ensure connections are not re-used across invocations
    sequelize.connectionManager.initPools();

    // restore `getConnection()` if it has been overwritten by `close()`
    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
      delete sequelize.connectionManager.getConnection;
    }
  }

  await loadModels();

  try {
    return await serverless(app)(...args);
  } finally {
    await getDb()?.connectionManager.close();
  }
};
