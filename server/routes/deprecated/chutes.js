const auth = require("../middleware/auth");
const { Chute, validate } = require("../models/chute");
const express = require("express");
const router = express.Router();

// name: Joi.string(),
// weight: Joi.number(),

router.post("/", auth, async (req, res) => {
  const { body } = req;

  if (!body.name) return res.status(400).send(`Bad request.`);

  const chute = new Chute({ ...body });
  await chute.save();

  return res.status(200).send(chute);
});

module.exports = router;
