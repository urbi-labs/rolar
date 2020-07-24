const auth = require("../middleware/auth");
const valID = require("../middleware/valID");
const val400 = require("../middleware/val400");
const { Origin, validate } = require("../models/origin");

const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  console.log("GET all origins...");

  const origin = await Origin.find().sort({
    name: "asc",
  });
  res.send(origin);
});

router.get("/:id", [auth, valID], async (req, res) => {
  const { id } = req.params;
  console.log(`GET origin ${id}`);

  const data = await Origin.findById(id);

  res.send(data);
});

router.post("/", [auth, val400(validate)], async (req, res) => {
  const { name } = req.body;

  let origin = await Origin.findOne({ name });

  if (origin)
    return res.status(400).send("La entidad ya se encuentra registrada.");

  origin = new Origin({ name });

  await origin.save();

  return res.status(200).send(origin);
});

router.put("/:id", [auth, val400(validate), valID], async (req, res) => {
  console.log(req.body);

  const { name } = req.body;

  const duplicate = await Origin.findOne({ name });
  if (duplicate && duplicate._id.toString() !== req.params.id)
    return res.status(400).send("La entidad ya se encuentra registrado.");

  let currentOrigin = await Origin.findById(req.params.id);

  const data = { name };

  currentOrigin = await Origin.findOneAndUpdate({ _id: req.params.id }, data, {
    new: true,
  });

  if (!currentOrigin)
    return res
      .status(404)
      .send(`La entidad con ID: ${req.params.id} no existe.`);

  await currentOrigin.save();

  return res.status(200).send(currentOrigin);
});

module.exports = router;
