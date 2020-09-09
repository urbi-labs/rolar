const auth = require("../routes/auth");
const users = require("../routes/users");
const batches = require("../routes/batches");
const storages = require("../routes/batches");
const tanks = require("../routes/tanks");
const tanksClosure = require("../routes/tanksClosure");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use("/api/batches", batches);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/tanks", tanks);
  app.use("/api/storages", storages);
  app.use("/api/tanksClosure", tanksClosure);
  app.use("/", (req, res) => {
    return res.status(200).send("hola");
  });
  app.use(error);
};

//ref
// id batch: 5f5695c6573a414b3a847952
// id user: 5f4fe8cd71164f1d5d65ae04
