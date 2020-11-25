const auth = require("../routes/auth");
const users = require("../routes/users");
const batches = require("../routes/batches");
const storages = require("../routes/storages");
const tanks = require("../routes/tanks");
const tanksClosure = require("../routes/tanksClosure");
const samples = require("../routes/samples");
const centrifuges = require("../routes/centrifuges");
const mills = require("../routes/mills");

const error = require("../middleware/error");

module.exports = function (app) {
  app.use("/api/samples", samples);
  app.use("/api/cent", centrifuges);
  app.use("/api/batch", batches);
  app.use("/api/mill", mills);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/tank", tanks);
  app.use("/api/storage", storages);
  app.use("/api/closures", tanksClosure);

  app.use(error);
};
