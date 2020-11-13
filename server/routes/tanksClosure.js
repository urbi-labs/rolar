const auth = require("../middleware/auth");
const { TankClosure, validate } = require("../models/tankClosure");
const { Tank } = require("../models/tank");
const { Storage } = require("../models/storage");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;
  const { _id, timestamp: eventTime, validated } = req.body;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const tankClosure = new TankClosure({ ...body });

  const { _tank } = body;

  // revisar filtro por fecha: tomar ultimo closure y filtrar storages en adelante
  // const lastClosureDate = await TankClosure.find({ _tank })
  //   .sort({
  //     timestamp: -1,
  //   })
  //   .exec();

  const batchArray = await Storage.find({ _tank }).select(
    "totalLitres timestamp"
  );

  tankClosure.batchArray = batchArray;

  try {
    await tankClosure.save();
    //TODO: Check this
    await Tank.findByIdAndUpdate({ _id: _tank }, { active: false });

    return res.status(200).send(tankClosure);
  } catch (error) {
    return res.status(500).send("Contacte al administrador.");
  }
});

router.put("/", auth, async (req, res) => {
  // update to tank clousure triggered
  const { body } = req;
  const { _id, batchArray, timestamp: eventTime } = req.body;

  body.validationDate = new Date();
  const sample = await TankClosure.findOneAndUpdate(
    { _id },
    { ...body },
    { new: true }
  );

  if (!validated) return res.status(200).send(sample);;

 /*  const batch = Batch.findById(item_lot);
  const { netWeight } = batch; */

  log("registering commision in foodtrust");
  const biz_loc = config.get("BIZ_LOC");
  const item_ref_in = config.get("ITEM_REF1");
  const item_ref_out = config.get("ITEM_REF2");
  const ftBody = {
    parentID: _id, //objeto en el cual se agregan los demás.
    childEPCs: batchArray,//objeto con los childs que se agregan 
    action: "ADD", // es simpre así, hace falta ponerla?
    biz_loc,
    eventTime,
    date_exp: new Date().toISOString(),
    date_sellby: new Date().toISOString(),
    date_best: new Date().toISOString(),
  };
  const FT = await submitToFoodtrust("transformation", ftBody);
  mill.FT = FT;
  return res.status(200).send(mill);

  
});

module.exports = router;
