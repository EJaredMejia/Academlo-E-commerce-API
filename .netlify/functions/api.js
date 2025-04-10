const serverless = require("serverless-http");
const { app } = require("../../app");
const { loadModels } = require("../../utils/load-models.util");

module.exports.handler = async function (...args) {
  const db = await loadModels();
  try {
    return await serverless(app)(...args);
  } finally {
    await db.connectionManager.close();
  }
};
