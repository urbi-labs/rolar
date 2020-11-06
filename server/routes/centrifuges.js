const auth = require("../middleware/auth");
const { validate, Centrifuge } = require("../models/centrifuge");
const { Batch } = require("../models/batch");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const centrifuge = new Centrifuge({
    ...body,
  });
  await centrifuge.save();

  // Actualizo el flag de ultimo status en el lote
  const { _batch: _id } = body;
  await Batch.findByIdAndUpdate({ _id }, { lastStatus: "cent" });

  return res.status(200).send(centrifuge);
});

router.put("/", auth, async (req, res) => {
  console.log("put triggered cent update");
  const { body } = req;
  const { _id } = req.body;

  body.validationDate = new Date();
  const sample = await Centrifuge.findOneAndUpdate(
    { _id },
    { ...body },
    { new: true }
  );

  return res.status(200).send(sample);
});

router.get("/", auth, async (req, res) => {
  const centrifuges = await Centrifuge.find().sort({
    timestamp: "desc",
  });
  res.send(centrifuges);
});

router.get("/batch/:id", auth, async (req, res) => {
  const { id: _batch } = req.params;
  const doc = await Centrifuge.findOne({ _batch });
  res.status(200).send(doc);
});

module.exports = router;
