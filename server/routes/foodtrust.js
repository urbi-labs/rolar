const chalk = require("chalk");
const log = (text) => console.log(chalk.magenta("[r/foodtrust]", text));

const { auth, srvAssets } = require("../services/foodtrust");

const { epcisCommission, epcisTransformation } = require("../services/xmlMsgs");
const { epcisObservation, epcisAggregation } = require("../services/xmlMsgs");

const express = require("express");
const router = express.Router();

const foodtrust = {
  commission: (values) => epcisCommission(values),
  transformation: (values) => epcisTransformation(values),
  observation: (values) => epcisObservation(values),
  aggregation: (values) => epcisAggregation(values),
};

router.get("/auth", async (req, res) => {
  const data = await auth();
  res.send(data);
});

router.post("/ilmd", async (req, res) => {
  log("get /ilms triggered");
  const { action } = req.query;
  const xml = await foodtrust[action](req.body);
  const { data } = await srvAssets(xml);
  res.send({ data, xml });
});

module.exports = router;
