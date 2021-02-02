const auth = require("../middleware/auth");
const { Batch } = require("../models/batch");
const { Sample } = require("../models/sample");
const { Centrifuge } = require("../models/centrifuge");
const { Storage } = require("../models/storage");
const { TankClosure } = require("../models/tankClosure");
const { Tank } = require("../models/tank");
const xls = require("excel4node");
const express = require("express");
const router = express.Router();

const sheets = {
  Lotes: () => Batch.find().sort({ timestamp: -1 }).lean(),
  Muestras: () => Sample.find().sort({ timestamp: -1 }).lean(),
  Molino: () => Centrifuge.find().sort({ timestamp: -1 }).lean(),
  Almacenamiento: () => Storage.find().sort({ timestamp: -1 }).lean(),
  Clausuras: () => TankClosure.find().sort({ timestamp: -1 }).lean(),
  Tanques: () => Tank.find().sort({ timestamp: -1 }).lean(),
};

router.get("/", async (req, res) => {
  const wb = new xls.Workbook();

  for (let sheet of Object.keys(sheets)) {
    const ws = wb.addWorksheet(sheet);
    const docs = await sheets[sheet]();

    // Headers
    Object.entries(docs[0]).forEach(([key, value], col) =>
      ws.cell(1, col + 1).string(`${key}`)
    );

    // Rows
    docs.forEach((doc, row) => {
      Object.entries(doc).forEach(([key, value], col) =>
        ws.cell(row + 2, col + 1).string(`${value}`)
      );
    });
  }

  const today = new Date();
  const fecha = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  wb.write(`export-${fecha}.xls`);

  res.send("ok");
});

module.exports = router;

// ([key, value], col) => console.log(`row ${row} col ${col} value ${value}`)
