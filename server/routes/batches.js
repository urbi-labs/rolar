const chalk = require("chalk");
const config = require("config");
const log = (text) => console.log(chalk.magenta("[r/foodtrust]", text));

// middleware
const auth = require("../middleware/auth");

// models
const { Batch, validate } = require("../models/batch");
const { Mill } = require("../models/mill");
const { Centrifuge } = require("../models/centrifuge");
const { Storage } = require("../models/storage");

const MODEL = {
  mill: Mill.find({ validated: true }).select("_batch"),
  cent: Centrifuge.find({ validated: true }).select("_batch"),
  storage: Storage.find({ validated: true }).select("_batch"),
};

// services
const { submitToFoodtrust } = require("../services/foodtrust");

const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const newBatch = {
    ...body,
  };

  await Batch.calcNetWeight(newBatch);

  const batch = new Batch({
    ...newBatch,
  });

  await batch.save();

  return res.status(200).send(batch);
});

router.get("/", auth, async (req, res) => {
  const batch = await Batch.find().sort({
    timestamp: "desc",
  });
  res.send(batch);
});

router.get("/status/:status", auth, async (req, res) => {
  const { params } = req;
  const { status } = params;

  const statusArray = status.split(",");

  log(`Verificando lotes ya validaddos...${JSON.stringify(statusArray)}`);

  let validated = [];
  for (let item of statusArray) {
    const docs = await MODEL[item];
    if (docs) {
      for (let doc of docs) {
        const { _batch } = doc;
        validated.push(_batch);
      }
    }
  }

  log(`ID de lote que serán filtrados...${JSON.stringify(validated)}`);

  const filter = {
    lastStatus: {
      $in: statusArray,
    },
    _id: {
      $nin: validated,
    },
  };

  const batch = await Batch.find(filter).sort({
    timestamp: -1,
  });

  res.status(200).send(batch);
});

router.get("/non_sampled/:id", auth, async (req, res) => {
  const { id: tookSample } = req.params;

  const batch = await Batch.find({ tookSample }).sort({ timestamp: -1 });

  res.status(200).send(batch);
});

router.get("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const batch = await Batch.findById(id);
  res.status(200).send(batch);
});

router.put("/", auth, async (req, res) => {
  console.log("put triggered mill update");
  const { body } = req;
  const { _id, timestamp: eventTime, validated } = req.body;

  log("updating batch on db...");
  body.validationDate = new Date();

  const updateBatch = {
    ...body,
  };

  await Batch.calcNetWeight(updateBatch);

  const batches = await Batch.findOneAndUpdate(
    { _id },
    { ...updateBatch },
    { new: true }
  );

  if (!validated) return res.status(200).send(batches);

  const { netWeight } = updateBatch;

  log("registering commision in foodtrust");
  const biz_loc = config.get("BIZ_LOC");
  const item_ref = config.get("ITEM_REF1");
  console.log({ netWeight });
  const ftBody = {
    item_ref,
    item_lot: _id,
    item_qty: netWeight, // definir la cantidad del lote chuteweith+??
    biz_loc,
    eventTime,
  };

  const FT = await submitToFoodtrust("commission", ftBody);
  batches.FT = FT;

  return res.status(200).send(batches);
});

module.exports = router;

// router.post("/tookSample/:_id", async (req, res) => {
//   console.log("/api/batches/tookSample/:_id");
//   const { params } = req;
//   const { _id } = params;

//   const batch = await Batch.findById(_id);

//   batch["tookSample"] = true;

//   await batch.save();

//   res.status(200).send(batch);
// });

// router.post("/:id/update_status", auth, async (req, res) => {
//   const { body, params } = req;
//   const { id } = params;
//   const { status } = body;

//   const batch = await Batch.findById(id);
//   batch["lastStatus"] = status;

//   console.log(batch);
//   await batch.save();

//   res.status(200).send(batch);
// });
