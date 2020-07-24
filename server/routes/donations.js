const auth = require("../middleware/auth");
const valID = require("../middleware/valID");
const { Donation, validate } = require("../models/donation");
const { Draw } = require("../models/draw");
const { bcAuth, bcRegTX, bcGetBlock } = require("../services/blockchain");

const { xlsxToJsDate } = require("../util/dates");

const config = require("config");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const chalk = require("chalk");
const log = (text) => console.log(chalk.yellow(`[donations] ${text}`));

router.get("/", auth, async (req, res) => {
  log("GET all Donations...");

  const donation = await Donation.find().sort({
    name: "asc",
  });
  res.send(donation);
});

router.get("/:id", [auth, valID], async (req, res) => {
  const { id } = req.params;
  log(`GET a donation ${id}`);

  const donation = await Donation.lookup(id);
  res.send(donation);
});

router.post("/", auth, async (req, res) => {
  const secret = config.get("jwtPrivateKey");

  const { data, hashFile, _origin, _user } = req.body;

  const donerId = data[0] ? data[0] + "" : data[0];
  const amount = isNaN(data[1]) ? 0 : parseInt(data[1]);
  const donationDate = xlsxToJsDate(data[2]);

  const donation = {
    donerId,
    amount,
    donationDate,
    transactionType: data[3],
    _origin,
    _user,
  };

  const { error } = await validate(donation);
  donation.error = error;

  let newDonation;
  if (!error) {
    const { token: bcToken } = await bcAuth();

    const {
      donerId,
      amount,
      donationDate,
      _origin,
      _user,
      transactionType,
    } = donation;

    newDonation = new Donation({
      donerId,
      amount,
      donationDate,
      _origin,
      _user,
      transactionType,
      hashFile,
    });

    const { _id } = await newDonation.save();
    log(`Saving donation... ${_id}`);

    const hashPayload = crypto
      .createHmac("sha256", secret)
      .update(_id + _origin + amount + donationDate)
      .digest("hex");

    // blockchain
    const bcTxId = await bcRegTX(bcToken, {
      id: _id, // Id de la donación en mongo
      bank_code: _origin, // Id del banco de origen
      amount: amount + "", // monto de la donación
      donationDate: new Date(donationDate).toISOString(),
      hash: hashPayload,
    });

    newDonation = await Donation.findByIdAndUpdate(
      { _id },
      { bcTxId, hashPayload },
      { new: true }
    );
    log(`Updating donation ${_id} with ${newDonation.bcTxId}`);
  }

  return res.status(200).send({ donation: error ? donation : newDonation });
});

router.get("/blockbytx/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { token: bcToken } = await bcAuth();
  const block = await bcGetBlock(bcToken, id);
  res.send(block);
});

router.get("/last/:id", [auth, valID], async (req, res) => {
  const { id: _user } = req.params;
  log(`GET last donation from user ${_user}`);

  const donation = await Donation.lastDonationByUser(_user);
  res.send(donation);
});

router.get("/stats/:id", [auth, valID], async (req, res) => {
  const { id: _origin } = req.params;
  log(`GET donation stats per user ${_origin}`);

  const donation = await Donation.getStats(_origin);
  res.send(donation);
});

router.post("/updatewinners/:id", [auth], async (req, res) => {
  //tomar draw
  const { id: _draw } = req.params;
  log("getting draw information...");
  const draw = await Draw.findById(_draw);

  const { winners, startDate, endDate } = draw;

  for (let winner of winners) {
    const { _id } = winner;
    const { donerId, _origin } = _id;

    const result = await Donation.updateWinner(
      startDate,
      endDate,
      donerId,
      _origin
    );

    // console.log(startDate + " " + endDate + " " + donerId + " " + _origin);
    console.log(result);
  }

  return res.status(200).send(winners);
});

module.exports = router;

// router.put("/:id", [auth, val400(validate), valID], async (req, res) => {
//   console.log(req.body);
//   const { id } = req.params;
//   const { chaincode } = req.body;

//   const donation = await Donation.findOneAndUpdate(
//     { _id: id },
//     { chaincode },
//     { new: true }
//   );

//   return res.status(200).send(donation);
// });
