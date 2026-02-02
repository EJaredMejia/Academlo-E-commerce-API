import serverless from "serverless-http";
import { getDb } from "../../src/utils/database.util";
import { loadModels } from "../../src/utils/load-models.util";
import type { Handler, HandlerResponse } from "@netlify/functions";
import { app } from "../../src/app";

export const handler: Handler = async function (event, context) {
  const sequelize = getDb();

  if (sequelize) {
    // restart connection pool to ensure connections are not re-used across invocations
    sequelize.connectionManager.initPools();

    // restore `getConnection()` if it has been overwritten by `close()`
    if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
      //@ts-ignore
      delete sequelize.connectionManager.getConnection;
    }
  }

  await loadModels();

  try {
    return (await serverless(app)(event, context)) as HandlerResponse;
  } finally {
    await getDb()?.connectionManager.close();
  }
};
