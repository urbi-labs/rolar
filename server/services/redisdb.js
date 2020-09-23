const fs = require("fs");
const config = require("config");

const chalk = require("chalk");
const log = (text) => console.log(chalk.red.bgWhite("[redis]", text));

const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const connectionString = config.get("REDIS_ENDPOINT");
const ca = fs.readFileSync(config.get("REDIS_CERTFILE"));

let client;
if (connectionString.startsWith("rediss://")) {
  // If this is a rediss: connection, we have some other steps.
  client = redis.createClient(connectionString, {
    tls: { ca, servername: new URL(connectionString).hostname },
  });
  // This will, with node-redis 2.8, emit an error:
  // "node_redis: WARNING: You passed "rediss" as protocol instead of the "redis" protocol!"
  // This is a bogus message and should be fixed in a later release of the package.
} else {
  client = redis.createClient(connectionString);
  // client.monitor();
}

const setToken = async (key, value, ttl) => {
  try {
    const data = await client.setAsync(key, value, "EX", ttl);
    return data;
  } catch (error) {
    log(error);
  }
};

const getToken = async (key) => {
  try {
    const data = await client.getAsync(key);
    return data;
  } catch (error) {
    log(error);
  }
};

client.monitor((err, res) => {
  log("srv:redis:getPairing => Entering monitoring mode.");
});

client.on("error", (err) => {
  log("srv:redis:getPairing => " + err);
});

client.on("connect", async () => {
  log("Connected to redis...");
});

client.on("end", () => {
  log("Redis connection terminated");
});

client.on("monitor", (time, args, raw_reply) => {
  const exclusions = ["PING", "PUBLISH", "info", "INFO", "AUTH", "rpush"];
  if (!exclusions.includes(args[0])) log(time + ": " + args);
});

exports.getToken = getToken;
exports.setToken = setToken;

// save, to snapshot
// flushall, to clear all data
// connect to cloud redis
// ./redli -u rediss://admin:8f79767399b28a3375c46b328002e1998fe4f9f3638cf3605aa6c3f773451c24@72ad0bf9-cbaf-40d4-95e0-17daffa64329.4b2136dd30a46e9b7bdb2b2db7f8cd0.databases.appdomain.cloud:30305/0 --certfile cert.pem
// ./redli -u rediss://admin:8f79767399b28a3375c46b328002e1998fe4f9f3638cf3605aa6c3f773451c24@72ad0bf9-cbaf-40d4-95e0-17daffa64329.4b2136ddd30a46e9b7bdb2b2db7f8cd0.databases.appdomain.cloud:30305/0 --certfile cert.pem
