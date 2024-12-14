"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(path.join(__dirname, "../config/config.js"))[env];
const db = {};
const log = require("log4js").getLogger("models:index");
log.level = "info";

let sequelize;

try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
  }

  // Test the connection
  await sequelize.authenticate();
  log.info("Database connection established successfully ✅");
} catch (error) {
  log.error("Database connection failure 🔥", error);
  process.exit(1);
}

// Read and import all model files
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.endsWith(".js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Apply associations if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize instance and Sequelize constructor to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;