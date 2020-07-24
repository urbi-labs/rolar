const auth = require("../middleware/auth");
const val400 = require("../middleware/val400");
const { Draw, validate } = require("../models/draw");
const { Donation } = require("../models/donation");
const { bcAuth, bcRegTX } = require("../services/blockchain");

const config = require("config");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const chalk = require("chalk");
const log = (text) => console.log(chalk.yellow(`[draws] ${text}`));

router.get("/", auth, async (req, res) => {
  log("GET all draws...");

  const draw = await Draw.find().sort({
    endDate: "asc",
  });
  res.send(draw);
});

router.post("/", [auth, val400(validate)], async (req, res) => {
  const { body } = req;
  const { name } = body;

  let draw = await Draw.findOne({ name });

  if (draw)
    return res.status(400).send("El encuentro ya se encuentra registrado.");

  draw = new Draw({ ...body });

  await draw.save();

  return res.status(200).send(draw);
});

router.get("/ballot/:id", auth, async (req, res) => {
  const { id: _draw } = req.params;
  log("getting draw information...");
  const draw = await Draw.findById(_draw);
  const { startDate, endDate } = draw;

  log("building lottery...");
  let lottery = await Donation.buildLottery(startDate, endDate);

  // chances son los numeros a sortear, un cliente pued

  const rounds = 40;
  const wins = rounds / 2;

  if (lottery.length === 0)
    res.status(500).send("ERROR: No hay chances para sortear.");

  log(`running lottery -> ${rounds} rounds`);
  const winners = [];
  const subs = [];
  try {
    for (let l = 0; l < rounds; l++) {
      const luckyNumber = Math.floor(Math.random() * lottery.length);

      if (l < wins) winners.push(lottery[luckyNumber]);
      else subs.push(lottery[luckyNumber]);

      const { donerId, _origin } = lottery[luckyNumber]._id;
      log(`lucky #${luckyNumber}, doner ${donerId} and origin ${_origin}`);

      lottery = lottery.filter(
        (item) =>
          !(item._id.donerId === donerId && item._id._origin === _origin)
      );

      log("chances " + lottery.length);
      if (lottery.length === 0) break;
    }

    log("registrando en blockchain");
    const secret = config.get("jwtPrivateKey");
    const hashPayload = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(winners) + JSON.stringify(subs))
      .digest("hex");
    const { token: bcToken } = await bcAuth();
    const bcTxId = await bcRegTX(bcToken, {
      id: _draw + new Date().toISOString(), // Id de la donación en mongo
      bank_code: JSON.stringify(winners), // Id del banco de origen
      amount: JSON.stringify(subs), // monto de la donación
      donationDate: new Date().toISOString(),
      hash: hashPayload,
    });

    draw.bcTxId = bcTxId;
    draw.hashPayload = hashPayload;
    draw.winners = winners;
    draw.subs = subs;

    log("guardando resultados...");
    await Draw.findOneAndUpdate(
      { _id: _draw },
      { winners, subs, bcTxId, hashPayload },
      { new: true }
    );

    return res.status(200).send(draw); //{ draw, winners, subs }
  } catch (ex) {
    console.log(ex);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/reset", auth, async (req, res) => {
  const reset = await Donation.resetWinners();
  return res.status(200).send(reset);
});

router.get("/current", auth, async (req, res) => {
  const currentDraw = await Draw.currentDraw();
  return res.status(200).send(currentDraw);
});

router.get("/totals/:id", auth, async (req, res) => {
  const { id: _draw } = req.params;

  log("getting draw information...");
  const { startDate, endDate } = await Draw.findById(_draw);

  log("calculating donations subtotals...");
  const lottery = await Donation.buildLottery(startDate, endDate);

  const count = lottery.filter((val, ind, self) => self.indexOf(val) === ind);
  const amount = count.reduce((acumm, current) => acumm + current.total, 0);

  return res.status(200).send({
    clients: count,
    chances: Math.floor(amount / 1000),
    amount,
  });
});

router.get("/lottery/:id", auth, async (req, res) => {
  const { id: _draw } = req.params;

  log("getting draw information...");
  const { startDate, endDate } = await Draw.findById(_draw);

  log("lottery.");
  const lottery = await Donation.buildLottery(startDate, endDate);

  return res.status(200).send({ lottery });
});

module.exports = router;

// log("updating winners...");
// console.log(winners.length);
// ceil = winners.length > 19 ? 20 : winners.length;

// for (let w = 0; w < ceil; w++) {
//   const { donerId, _origin } = winners[w]._id;
//   log(startDate + " " + endDate + " " + donerId + " " + _origin);
//   const updateWinner = await Donation.updateWinner(
//     startDate,
//     endDate,
//     donerId,
//     _origin
//   );
//   console.log(updateWinner);
// }
