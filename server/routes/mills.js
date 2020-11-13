const chalk = require("chalk");
const config = require("config");
const log = (text) => console.log(chalk.magenta("[r/foodtrust]", text));

// middleware
const auth = require("../middleware/auth");

// models
const { Mill, validate } = require("../models/mill");
const { Batch } = require("../models/batch");

// services
const { submitToFoodtrust } = require("../services/foodtrust");

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

router.put("/", auth, async (req, res) => {
  console.log("put triggered mill update");
  const { body } = req;
  const { _id, timestamp: eventTime, _batch: item_lot, validated } = req.body;

  log("updating mill on db...");
  body.validationDate = new Date();

  console.log({ ...body });
  const mill = await Mill.findOneAndUpdate({ _id }, { ...body }, { new: true });

  if (!validated) return res.status(200).send(mill);

  console.log({ item_lot });
  const batch = await Batch.findById(item_lot).exec();
  const { netWeight } = batch;

  console.log({ netWeight });
  log("registering commision in foodtrust");
  const biz_loc = config.get("BIZ_LOC");
  const item_ref_in = config.get("ITEM_REF1");
  const item_ref_out = config.get("ITEM_REF2");
  const ftBody = {
    item_ref_in,
    item_lot_in: item_lot,
    item_qty_in: netWeight,
    item_ref_out,
    item_lot_out: item_lot,
    item_qty_out: netWeight,
    biz_loc,
    eventTime,
  };
  const FT = await submitToFoodtrust("transformation", ftBody);
  mill.FT = FT;
  return res.status(200).send(mill);
});

router.get("/", auth, async (req, res) => {
  const mills = await Mill.find().sort({
    timestamp: "desc",
  });
  res.send(mills);
});

router.get("/batch/:id", auth, async (req, res) => {
  const { id: _batch } = req.params;
  const doc = await Mill.findOne({ _batch });
  res.status(200).send(doc);
});

module.exports = router;
