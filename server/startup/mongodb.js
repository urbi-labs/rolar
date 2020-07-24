const fs = require("fs");
const mongoose = require("mongoose");
const config = require("config");

const chalk = require("chalk");
const log = (text) => console.log(chalk.greenBright(`[mongodb] ${text}`));

module.exports = async (env) => {
  // Disable deprecation warnings
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);

  // Initial mongo settings
  const options = {
    keepAlive: 1,
    connectTimeoutMS: 30000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Detecting if should conect to local mongo server
  const local = env === "test";
  log(`connecting to ${local ? "local" : "remote"} server ... `);

  const dbName = !local
    ? config.get(`DB_${env === "production" ? "PROD" : "DEV"}`)
    : config.get("dbName");

  const dbHost = !local ? config.get("DB_HOST") : config.get("dbHost");
  const dbUser = !local ? config.get("DB_USER") : "";
  const dbPass = !local ? config.get("DB_PASS") : "";

  const uri = !local
    ? `mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}?authSource=admin&replicaSet=replset`
    : `mongodb://${dbHost}/${local}`;

  if (!local) {
    options.ssl = true;
    options.sslCA = fs.readFileSync(config.get("DB_CERT"));
  }

  try {
    await mongoose.connect(uri, options);
    log(
      `connected to ${dbName} on ${env} env at ${local ? "local" : "remote"}...`
    );
  } catch (error) {
    if (local) log("¿Did you start mongod demon?");
    log(error.message);
  }
};
