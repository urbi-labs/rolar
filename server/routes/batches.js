const auth = require("../middleware/auth");
const { Batch, validate } = require("../models/batch");
const express = require("express");
const router = express.Router();

router.post("/" ,async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const newBatch = {
    ...body,
  };

  await Batch.calcNetWeight(newBatch);

  const batch = new Batch({
    ...newBatch
  });

  await batch.save();

  return res.status(200).send(batch);
});

router.get("/", async (req, res) => {
  const batch = await Batch.find().sort({
    timestamp: "desc",
  });
  res.send(batch);
});

router.post("/:id/update_status", async(req,res) => {
  const { body, params } = req;
  const { id } = params;
  const { status } = body; 

  const batch = await Batch.findById(id);
  batch['lastStatus'] = status;

  console.log(batch)
  await batch.save();

  res.status(200).send(batch);
});

router.get("/status/:status", async(req,res) => {
  console.log("/api/batches/status/:status")
  const { params } = req;
  const { status } = params; 
  console.log(status);

  const batch = await Batch.find({lastStatus : status})
  
  res.status(200).send(batch)
});


router.get("/non_sampled", async(req,res) => {
  console.log("api/batches/non_sampled")
  const batch = await Batch.find({tookSample : false})
  
  res.status(200).send(batch)
});

router.get("/:id", async(req,res) => {
  console.log("/:id")
  const { params } = req;
  const { id } = params; 
  console.log(id);

  const batch = await Batch.findById(id);

  res.status(200).send(batch)
});

router.post("/tookSample/:_id", async(req,res) => {
  console.log("/api/batches/tookSample/:_id")
  const { params } = req;
  const { _id } = params;

  const batch = await Batch.findById(_id);

  batch["tookSample"] = true;

  await batch.save();

  res.status(200).send(batch)
});

module.exports = router;
