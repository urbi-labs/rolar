const auth = require("../routes/auth");
const users = require("../routes/users");

const error = require("../middleware/error");

module.exports = function (app) {
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/", (req, res) => {
    return res.status(200).send("hola");
  });
  app.use(error);
};
