import { DataTypes, Sequelize } from "sequelize";
import type { Dialect, Options } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Ensure environment variables are loaded
dotenv.config({ path: path.join(__dirname, "../../config.env") });

let sequelizeInstance: Sequelize | null = null;

export function getDb(): Sequelize {
  if (!sequelizeInstance) {
    const options: Options = {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      dialect: "postgres" as Dialect,
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    };

    const database = process.env.DB || "test";
    const username = process.env.DB_USERNAME || "postgres";
    const password = process.env.DB_PASSWORD || "postgres";

    sequelizeInstance = new Sequelize(database, username, password, options);
  }

  return sequelizeInstance;
}

export { DataTypes };
