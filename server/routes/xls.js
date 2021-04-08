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

const path = require("path");
const cwd = process.cwd();

const sheets = {
  Lotes: () => Batch.find().sort({ timestamp: -1 }).lean(),
  Muestras: () => Sample.find().sort({ timestamp: -1 }).lean(),
  Molino: () => Centrifuge.find().sort({ timestamp: -1 }).lean(),
  Almacenamiento: () => Storage.find().sort({ timestamp: -1 }).lean(),
  Clausuras: () => TankClosure.find().sort({ timestamp: -1 }).lean(),
  Tanques: () => Tank.find().sort({ timestamp: -1 }).lean(),
};

router.post("/", auth, async (req, res) => {
  const wb = new xls.Workbook({
    dateFormat: "d/m/yy hh:mm:ss",
  });

  for (let sheet of Object.keys(sheets)) {
    const ws = wb.addWorksheet(sheet);
    const docs = await sheets[sheet]();

    if (docs.length > 0) {
      // Headers
      Object.entries(docs[0]).forEach(([key, value], col) =>
        ws.cell(1, col + 1).string(`${key}`)
      );

      // Rows
      docs.forEach((doc, row) => {
        Object.entries(doc).forEach(([key, value], col) => {
          // console.log(`${typeof value}, ${value}, ${value instanceof Date}`);
          // ws.cell(row + 2, col + 1).string(`${value}`)

          switch (typeof value) {
            case "number":
              ws.cell(row + 2, col + 1).number(value);
              break;

            default:
              if (value instanceof Date) {
                ws.cell(row + 2, col + 1).date(new Date(value));
                break;
              }

              ws.cell(row + 2, col + 1).string(`${value}`);
              break;
          }
        });
      });
    }
  }

  const xlsPath = path.join(cwd, `build/export.xlsx`);
  console.log("exporting xlsx...");
  console.log(xlsPath);
  await wb.write(xlsPath);

  res.status(200).send("OK");
});

module.exports = router;

// ([key, value], col) => console.log(`row ${row} col ${col} value ${value}`)
