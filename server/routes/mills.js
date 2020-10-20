const auth = require("../middleware/auth");
const { validate, Mill } = require("../models/mill");
const express = require("express");
const router = express.Router();

router.post("/", /*auth,*/async (req, res) => {
  const { body } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const mill = new Mill({
    ...body,
  });
  await mill.save();

  return res.status(200).send(mill);
});

router.get("/", /*auth,*/async (req, res) => {
  const mills = await Mill.find().sort({
    timestamp: "desc",
  });
  res.send(mills);
});

module.exports = router;
