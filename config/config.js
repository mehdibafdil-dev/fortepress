require("dotenv").config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME_DEV,
  DB_NAME_TEST,
  DB_HOST,
  DB_NAME_PROD,
  DB_PASSWORD_PROD,
} = process.env;

const commonConfig = {
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  dialect: "mysql",
};

module.exports = {
  development: {
    ...commonConfig,
    database: DB_NAME_DEV,
    logging: false,
  },
  test: {
    ...commonConfig,
    database: DB_NAME_TEST,
  },
  production: {
    username: DB_USERNAME || "root", // Fallback to 'root' if not set
    password: DB_PASSWORD_PROD || null, // Use environment variable for production password
    database: DB_NAME_PROD || "database_production", // Use environment variable for production database name
    host: DB_HOST || "127.0.0.1", // Use environment variable for production host
    dialect: "mysql",
  },
};