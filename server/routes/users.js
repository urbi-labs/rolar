const auth = require("../middleware/auth");
// const valID = require("../middleware/valID");
const val400 = require("../middleware/val400");
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/", /*auth  , */async (req, res) => {
  const user = await User.find().sort({ timestamp: "desc" });
  res.send(user);
});

// router.get("/:id", [auth, valID], async (req, res) => {
//   const { id } = req.params;
//   const user = await User.lookup(id);
//   res.send(user);
// });

router.post("/", [auth, val400(validate)], async (req, res) => {
  console.log("USERS post...");
  const { body } = req;

  // check unique
  const { name } = body;

  let user = await User.findOne({ name });
  if (user)
    return res.status(400).send("El usuario ya se encuentra registrado.");

  console.log(body);
  user = new User(body);

  // store encrypted password
  const salt = await bcrypt.genSalt(10);
  let { password } = user;
  password = await bcrypt.hash(password, salt);
  user.password = password;

  await user.save();

  return res.status(200).send(user);
});

module.exports = router;
