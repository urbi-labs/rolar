const auth = require("../middleware/auth");
const valID = require("../middleware/valID");
const val400 = require("../middleware/val400");
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await User.find().sort({ updated: "desc" });
  res.send(user);
});

router.get("/:id", [auth, valID], async (req, res) => {
  const { id } = req.params;
  const user = await User.lookup(id);
  res.send(user);
});

router.post("/", [val400(validate)], async (req, res) => {
  console.log("USERS post...");
  const { body } = req;

  // check mail
  const { mail } = body;
  let user = await User.findOne({ mail });
  if (user) return res.status(400).send("El mail ya se encuentra registrado.");

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

router.put("/:id", [auth, val400(validate), valID], async (req, res) => {
  const { body } = req;
  const { id: _id } = req.params;

  // check mail doesn't belong to another user
  const { mail } = body;
  const duplicate = await User.findOne({ mail });
  const sameUser = duplicate._id.toString() === _id;

  if (duplicate && !sameUser)
    return res.status(400).send("El mail ya se encuentra registrado.");

  // store encrypted password
  const salt = await bcrypt.genSalt(10);
  let { password } = body;
  password = await bcrypt.hash(password, salt);
  body.password = password;

  const user = await User.findOneAndUpdate(
    { _id },
    { ...body },
    {
      new: true,
    }
  );

  if (!user)
    return res.status(404).send(`El usuario con ID: ${_id} no existe.`);

  return res.status(200).send(user);
});

module.exports = router;
