const { getDb } = require("./database.util");
const { initModels } = require("./../models/initModels");

async function loadModels() {
  await getDb().authenticate();

  // Establish the relations between models
  initModels();

  await getDb().sync();
}

module.exports = { loadModels };
