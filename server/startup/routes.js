const auth = require("../routes/auth");
const users = require("../routes/users");
const batches = require("../routes/batches");
const samples = require("../routes/samples");
const centrifuges = require("../routes/centrifuges");
const mills = require("../routes/mills");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use("/api/samples", samples);
  app.use("/api/centrifuges", centrifuges);
  app.use("/api/batches", batches);
  app.use("/api/mills", mills);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/", (req, res) => {
    return res.status(200).send("hola");
  });
  app.use(error);
};
