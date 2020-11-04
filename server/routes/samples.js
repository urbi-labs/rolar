const auth = require("../middleware/auth");
const { Sample, validate } = require("../models/sample");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const sample = new Sample({
    ...body,
  });
  await sample.save();

  return res.status(200).send(sample);
});

router.put("/", auth, async (req, res) => {
  console.log("put triggered sample update");
  const { body } = req;
  const { _id } = req.body;

  const sample = await Sample.findOneAndUpdate(
    { _id },
    { ...body },
    { new: true }
  );

  return res.status(200).send(sample);
});

router.get("/", auth, async (req, res) => {
  const samples = await Sample.find().sort({
    timestamp: "desc",
  });
  res.send(samples);
});

router.get("/batch/:id", async (req, res) => {
  const { id: _batch } = req.params;
  const doc = await Sample.findOne({ _batch });
  res.status(200).send(doc);
});

module.exports = router;
