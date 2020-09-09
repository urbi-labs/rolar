const auth = require("../middleware/auth");
const { Tank, validate } = require("../models/tank");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const tank = new Tank({ ...body });
  await tank.save();

  return res.status(200).send(tank);
});

module.exports = router;
