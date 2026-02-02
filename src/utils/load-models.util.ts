import { getDb } from "./database.util";
import { initModels } from "./init-models";

export async function loadModels() {
  await getDb().authenticate();

  // Establish the relations between models
  initModels();

  await getDb().sync();
}
