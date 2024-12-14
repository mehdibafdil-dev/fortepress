/**
 * FortePress - A robust Node.js boilerplate for building production-ready RESTful APIs.
 * 
 * Author: Mehdi BAFDIL
 * Email: mehdibafdil@gmail.com
 * GitHub: https://github.com/mehdibafdil-dev/fortepress
 * 
 * This project is open-source and available under the MIT License.
 * Feel free to contribute and make improvements!
 * 
 * Created on: December 14, 2024
 * Last updated: 14/12/2024
 */

"use strict";

require("dotenv").config();
require("pretty-error").start();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const hpp = require("hpp");
const helmet = require("helmet");
const log4js = require("log4js");
const dayjs = require("dayjs");
const { errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure logging
const log = log4js.getLogger("entrypoint");
log.level = "info";

// Configure log4js
log4js.configure({
  appenders: {
    app: {
      type: "dateFile",
      filename: "./logs/app.log",
      numBackups: 3,
      layout: {
        type: "pattern",
        pattern: "%x{id}: [%x{info}] %p %c - %[%m%]",
        tokens: {
          id: () => Date.now(),
          info: () => dayjs().format("D/M/YYYY h:mm:ss A"),
        },
      },
      maxLogSize: 7000000, // 7 MB
    },
    console: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "%x{id}: [%x{info}] %p %c - %[%m%]",
      },
    },
  },
  categories: {
    default: { appenders: ["app", "console"], level: "debug" },
  },
});

// Middleware setup
app.use(helmet());
app.use(hpp());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom morgan token for logging
morgan.token("time", (req) => {
  const user = req.user?.name || "anonym";
  return `${dayjs().format("h:mm:ss A")} - ${user}`;
});
app.use(morgan("morgan: [:time] :method :url - :status"));
// Routes
app.use(routes);

// Custom error handler
app.use(errorHandler);

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    log.error(`Error: ${err}`);
    process.exit(1);
  }
  log.info(`Server is running on port: ${PORT}`);
});

module.exports = app;