const auth = require("../middleware/auth");
const { TankClosure, validate } = require("../models/tankClosure");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const tankClosure = new TankClosure({ ...body });
  await tankClosure.save();

  return res.status(200).send(tankClosure);
});

module.exports = router;
