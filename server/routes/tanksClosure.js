const auth = require("../middleware/auth");
const { TankClosure, validate } = require("../models/tankClosure");
const { Tank } = require("../models/tank");
const { Storage } = require("../models/storage");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

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

module.exports = router;
