const auth = require("../middleware/auth");
const { Storage, validate } = require("../models/storage");

const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const newStorage = { ...body };

  await Storage.calcTotals(newStorage);

  const storage = new Storage({ ...newStorage });

  await storage.save();

  return res.status(200).send(storage);
});

module.exports = router;
