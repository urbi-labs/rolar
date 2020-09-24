const chalk = require("chalk");
const log = (text) => console.log(chalk.magenta("[r/foodtrust]", text));

const { srvItems, srvLocations, auth } = require("../services/foodtrust");
const { srvAssets, srvLots, srvTraces } = require("../services/foodtrust");
const { mdItem, mdFacility } = require("../services/xmlMsgs");
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

router.post("/trace", async (req, res) => {
  log("body", req.body);
  const { item_id } = req.body;
  const { data } = await srvTraces(item_id);
  log(data);
  res.send(data);
});

router.get("/itemsdcodes", async (req, res) => {
  log("get /itemsdcodes triggered");
  const fs = require("fs");
  const data = JSON.parse(
    fs.readFileSync("./XMLMessages/GS1_ItemDisp.json", "utf8")
  );
  res.send(data);
});

router.get("/locations", async (req, res) => {
  log("get /locations triggered");
  const data = await srvLocations();
  res.send(data);
});

router.get("/items", async (req, res) => {
  log("get /items triggered");
  const data = await srvItems();
  res.send(data);
});

router.get("/lots", async (req, res) => {
  log("get /lots triggered", req.query);

  const { pages, start } = req.query;

  console.log({ pages });
  console.log({ start });

  const { lots_and_serials, next } = await srvLots(pages, start);

  const promises = lots_and_serials.map(async (lot) => {
    const { id } = lot;
    const { data } = await srvTraces(id);
    return data;
  });

  const traces = await Promise.all(promises);

  let model = [];
  traces.forEach((trace, ind) => {
    const { events, lots_and_serials, products } = trace;
    const events_total = events.length;
    const { id } = lots_and_serials[0];
    const lote = id.split(".").pop();
    const { description, object_sku } = products[0] || {
      description: "dummy",
      object_sku: "dummy",
    };

    model.push({
      id: ind,
      lote,
      description,
      object_sku,
      events_total,
      events,
    });
  });

  res.send({ model, next });
});

router.post("/ilmd", async (req, res) => {
  log("get /ilms triggered");
  const { action } = req.query;
  const xml = await foodtrust[action](req.body);
  const { data } = await srvAssets(xml);
  res.send({ data, xml });
});

module.exports = router;
