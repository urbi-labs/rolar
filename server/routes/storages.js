const auth = require("../middleware/auth");
const { Storage, validate } = require("../models/storage");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const storage = new Storage({ ...body });
  await storage.save();

  return res.status(200).send(storage);
});

module.exports = router;
