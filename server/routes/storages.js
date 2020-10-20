const auth = require("../middleware/auth");
const { Storage, validate } = require("../models/storage");
const { TankClosure } = require("../models/tankClosure");

const express = require("express");
const router = express.Router();

router.post("/",/* auth, */async (req, res) => {
  const { body } = req;
  console.log(body)
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const newStorage = { ...body };

  await Storage.calcTotals(newStorage);

  const storage = new Storage({ ...newStorage });

  await storage.save();

  return res.status(200).send(storage);
});

router.get("/tank/:tank_id",async(req,res) => {
  console.log("/api/storages/tank/:tank_id")
  const { params } = req;
  const { tank_id } = params;

  const lastTankClosure = await TankClosure.findOne({_tank: tank_id},null,{sort:{timestamp:-1}});
  console.log(lastTankClosure);

  if(lastTankClosure===null){
    res.status(400).send("No existen registros para este tanque");
    return;
  }

  const { timestamp } = lastTankClosure;
  const batches = await Storage.find({
    _tank: tank_id, 
    timestamp: {
      $gt: timestamp
    }
  });

  res.status(200).send(batches);
});

module.exports = router;
