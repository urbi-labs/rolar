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
  const { _id, timestamp: eventTime, _batch: item_lot } = req.body;

  log("updating mill on db...");
  body.validationDate = new Date();
  const mill = await Mill.findOneAndUpdate({ _id }, { ...body }, { new: true });

  log("registering commision in foodtrust");
  const biz_loc = config.get("BIZ_LOC");
  const item_ref = config.get("ITEM_REF1");
  const ftBody = {
    item_ref,
    item_lot,
    item_qty: 5, // definir la cantidad del lote chuteweith+??
    biz_loc,
    src_loc: biz_loc,
    dest_loc: biz_loc,
    eventTime,
    date_exp: new Date().toISOString(),
    date_sellby: new Date().toISOString(),
    date_best: new Date().toISOString(),
  };
  const FT = await submitToFoodtrust("commission", ftBody);
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
