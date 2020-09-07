const auth = require("../middleware/auth");
const { Batch, validate } = require("../models/batch");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const batch = new Batch({ ...body });
  await batch.save();

  return res.status(200).send(batch);
});

module.exports = router;
