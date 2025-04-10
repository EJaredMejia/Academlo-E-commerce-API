const serverless = require("serverless-http");
const { app } = require("../../app");
const { loadModels } = require("../../utils/load-models.util");

module.exports.handler = async function () {
  const db = await loadModels();
  try {
    console.log(db);
    return serverless(app);
  } finally {
    console.log("finally");
    console.log(db);
    await db.connectionManager.close();
  }
};
