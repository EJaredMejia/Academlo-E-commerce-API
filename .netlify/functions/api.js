const serverless = require("serverless-http");
const { app } = require("../../app");
const { loadModels } = require("../../utils/load-models.util");

module.exports.handler = async function () {
  const db = await loadModels();
  try {
    return serverless(app);
  } finally {
    await db.connectionManager.close();
  }
};
