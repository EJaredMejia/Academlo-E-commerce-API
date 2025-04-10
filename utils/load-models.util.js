const { db } = require("./database.util");
const { initModels } = require("./../models/initModels");

async function loadModels() {
  console.log("loading models");
  console.log(db);
  await db.authenticate();

  // Establish the relations between models
  initModels();

  await db.sync();

  return db;
}

module.exports = { loadModels };
