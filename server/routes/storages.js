const auth = require("../middleware/auth");
const { Storage, validate } = require("../models/storage");
const { Tank } = require("../models/tank");
const { Batch } = require("../models/batch");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const newStorage = { ...body };
  const { _batch, _tank, initialMeasure, finalMeasure } = newStorage;

  //lookup tank cone property
  const tank = await Tank.findById(_tank);

  const { cone, radius } = tank;

  newStorage.totalCm = finalMeasure - initialMeasure;
  const { totalCm } = newStorage;

  newStorage.totalLitres =
    cone + Math.PI * ((Math.pow(radius / 1000, 2) * totalCm) / 1000) * 1000;

  const { totalLitres } = newStorage;
  newStorage.oilWeight = totalLitres * 0.92;

  const batch = await Batch.findById(_batch);
  const { netWeight } = batch;
  const { oilWeight } = newStorage;
  newStorage.performance = oilWeight / netWeight;

  const storage = new Storage({ ...newStorage });

  await storage.save();

  return res.status(200).send(storage);
});

module.exports = router;
