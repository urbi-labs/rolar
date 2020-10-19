// const auth = require("../middleware/auth");
const { Batch, validate } = require("../models/batch");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
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

router.get("/:id", async(req,res) => {
  const { params } = req;
  const { id } = params; 
  console.log(id);

  const batch = await Batch.findById(id);

  res.status(200).send(batch)
})

module.exports = router;
