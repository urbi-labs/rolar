const chalk = require("chalk");
const config = require("config");
const log = (text) => console.log(chalk.magenta("[r/foodtrust]", text));

// middleware
const auth = require("../middleware/auth");

// models
const { TankClosure, validate } = require("../models/tankClosure");
const { Tank } = require("../models/tank");
const { Storage } = require("../models/storage");

// services
const { submitToFoodtrust } = require("../services/foodtrust");

const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const tankClosure = new TankClosure({ ...body });

  const { _tank } = body;

  // revisar filtro por fecha: tomar ultimo closure y filtrar storages en adelante
  const { timestamp: lastClosure } = await TankClosure.find({ _tank })
    .sort({
      timestamp: -1,
    })
    .exec();

  const batchArray = !lastClosure
    ? await Storage.find({ _tank })
    : await Storage.find({
        _tank,
        timestamp: {
          $gt: lastClosure,
        },
      });

  tankClosure.batchArray = batchArray;

  try {
    await tankClosure.save();
    await Tank.findByIdAndUpdate({ _id: _tank }, { active: false });

    return res.status(200).send(tankClosure);
  } catch (error) {
    return res.status(500).send("Contacte al administrador.");
  }
});

router.put("/", auth, async (req, res) => {
  // update to tank clousure triggered
  const { body } = req;
  const { _id, timestamp: eventTime, validated, batchArray } = req.body;

  body.validationDate = new Date();
  const closure = await TankClosure.findOneAndUpdate(
    { _id },
    { ...body },
    { new: true }
  );

  if (!validated) return res.status(200).send(closure);

  /*  const batch = Batch.findById(item_lot);
  const { netWeight } = batch; */
  //   {
  //     "item_ref": "rp0002",
  //     "item_lot": 3020,
  //     "item_qty": 100,
  //     "biz_loc": "rf0001",
  //     "pallet": "pallet01"
  // }

  log("registering commision in foodtrust");
  const biz_loc = config.get("BIZ_LOC");
  // const item_ref_in = config.get("ITEM_REF1");
  // const item_ref_out = config.get("ITEM_REF2");
  const ftBody = {
    pallet: _id, //objeto en el cual se agregan los demás.
    batchArray, //objeto con los childs que se agregan
    biz_loc,
    eventTime,
    // date_exp: new Date().toISOString(),
    // date_sellby: new Date().toISOString(),
    // date_best: new Date().toISOString(),
  };
  const FT = await submitToFoodtrust("aggregation", ftBody);
  closure.FT = FT;
  return res.status(200).send(closure);
});

module.exports = router;
