const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const pg = require("pg");

const { Sequelize } = require("sequelize");

function getSequelize() {
  const params =
    process.env.SERVERLESS === "true"
      ? {
          pool: {
            max: 2,
            min: 0,
            idle: 0,
            acquire: 3000,
          },
        }
      : {};

  return new Sequelize({
    dialect: "postgres",
    dialectModule: pg,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB,
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
    ...params,
  });
}

module.exports = { getSequelize };
