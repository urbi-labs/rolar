const auth = require("../middleware/auth");
const { validate, Mill } = require("../models/mill");
const { Batch } = require("../models/batch");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const mill = new Mill({
    ...body,
  });
  await mill.save();

  // Actualizo el flag de ultimo status en el lote
  const { _batch: _id } = body;
  await Batch.findByIdAndUpdate({ _id }, { lastStatus: "mill" });

  return res.status(200).send(mill);
});

router.get("/", auth, async (req, res) => {
  const mills = await Mill.find().sort({
    timestamp: "desc",
  });
  res.send(mills);
});

router.get("/batch/:id", async (req, res) => {
  const { id: _batch } = req.params;
  const doc = await Mill.findOne({ _batch });
  res.status(200).send(doc);
});

module.exports = router;
