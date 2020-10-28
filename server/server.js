const start = Date.now();

require("dotenv").config();
const config = require("config");
const { name } = require("../package.json");
const winston = require("winston");

const cors = require("cors");
const express = require("express");
const app = express();

const env = app.get("env");
const chalk = require("chalk");
const log = (text) =>
  env !== "test" ? console.log(chalk.cyan(`[server] ${text}`)) : null;

// server setup
app.use(cors());
app.use(express.json());

require("./startup/logging")(winston, env);
require("./startup/routes")(app, env);
require("./startup/mongodb")(env);

//Logging only on development environment
const protocol = config.get("protocol");
const host = process.env.docker || config.get("host");
const port = process.env.PORT || config.get("port");

if (env !== "production") {
  const morgan = require("morgan");
  app.use(morgan("tiny"));
  log("morgan enabled");
} else {
  require("./startup/prod")(app);
}

log(`environment: ${env}`);

const server = app.listen(port, () => {
  winston.info(
    `${name} booted in ${Date.now() - start}ms at ${protocol}://${host}:${port}`
  );
  log(
    `${name} booted in ${Date.now() - start}ms at ${protocol}://${host}:${port}`
  );
});

module.exports = server;
