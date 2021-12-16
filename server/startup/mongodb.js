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
    useUnifiedTopology: true
  };

  // Detecting if should conect to local mongo server
  // force connection to prod
  const local = env === "development";
  log(`connecting to remote server ... `);

  const dbName = config.get(`DB_PROD`);

  const dbHost = !local ? config.get("DB_HOST") : config.get("dbHost");
  const dbUser = !local ? config.get("DB_USER") : config.get("dbUser");
  const dbPass = !local ? config.get("DB_PASS") : config.get("dbPass");

  const uri = local
    ? `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?authSource=admin&replicaSet=replset&retryWrites=true&w=majority`
    : `mongodb://${dbHost}/${dbName}`;

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
