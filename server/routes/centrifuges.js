const auth = require("../middleware/auth");
const { validate, Centrifuge } = require("../models/centrifuge");
const express = require("express");
const router = express.Router();

router.post("/", /*auth,*/ async (req, res) => {
  const { body } = req;
  
  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);

  const centrifuge = new Centrifuge({
    ...body,
  });
  await centrifuge.save();

  return res.status(200).send(centrifuge);
});

router.get("/", auth, async (req, res) => {
  const centrifuges = await Centrifuge.find().sort({
    timestamp: "desc",
  });
  res.send(centrifuges);
});

module.exports = router;
