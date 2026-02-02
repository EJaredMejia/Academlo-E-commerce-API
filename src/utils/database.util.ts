import { DataTypes, Sequelize } from "sequelize";
import type { Dialect, Options } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import pg from "pg";

// Ensure environment variables are loaded
dotenv.config({ path: path.join(__dirname, "../../config.env") });

let sequelizeInstance: Sequelize | null = null;

export function getDb(): Sequelize {
  if (sequelizeInstance) {
    return sequelizeInstance;
  }

  sequelizeInstance = new Sequelize({
    dialect: "postgres",
    dialectModule: pg,
    host: process.env.DB_HOST || "localhost",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB || "test",
    logging: false,
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    ...(process.env.SERVERLESS === "true"
      ? {
          pool: {
            max: 2,
            min: 0,
            idle: 0,
            acquire: 3000,
          },
        }
      : {}),
  });

  return sequelizeInstance;
}

export { DataTypes };
