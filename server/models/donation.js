const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;
const { Origin } = require("./origin");

Joi.objectId = require("joi-objectid")(Joi);

const donationSchema = new Schema({
  donerId: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, default: 0 },
  donationDate: { type: Date, required: true },
  _origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Origin",
    required: true,
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transactionType: { type: String, default: "" },
  winner: { type: Boolean, default: false },
  hashFile: { type: Object, default: "" },
  bcTxId: { type: String, default: "" },
  hashPayload: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
});

donationSchema.statics.buildLottery = async function (startDate, endDate) {
  const buildLottery = await this.aggregate([
    {
      $match: {
        $and: [
          { donationDate: { $gte: startDate } },
          { donationDate: { $lte: endDate } },
          { winner: { $ne: true } },
        ],
      },
    },
    {
      $group: {
        _id: {
          donerId: "$donerId",
          _origin: "$_origin",
        },
        transactionType: { $first: "$transactionType" },
        total: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "origins",
        localField: "_id._origin",
        foreignField: "_id",
        as: "origin",
      },
    },
  ]);

  const lottery = [];
  console.log("generating lottery...");
  buildLottery.forEach((doner) => {
    const { total } = doner;
    const chances = Math.floor(total / 1000);
    for (let n = 0; n < chances; n++) {
      lottery.push(doner);
    }
  });

  return lottery;
};

donationSchema.statics.getBallotDonations = async function (
  startDate,
  endDate
) {
  return await this.aggregate([
    {
      $match: {
        $and: [
          { donationDate: { $gte: startDate } },
          { donationDate: { $lte: endDate } },
          { winner: { $ne: true } },
        ],
      },
    },
  ]).exec();
};

donationSchema.statics.updateWinner = async function (
  startDate,
  endDate,
  donerId,
  _origin
) {
  return await this.updateMany(
    {
      $and: [
        { donationDate: { $gte: startDate } },
        { donationDate: { $lte: endDate } },
        { donerId: { $eq: donerId } },
        { _origin: { $eq: _origin } },
      ],
    },
    { $set: { winner: true } },
    { multi: true }
  ).exec();
};

donationSchema.statics.resetWinners = async function () {
  return await this.updateMany(
    {},
    { $set: { winner: false } },
    { multi: true }
  ).exec();
};

donationSchema.statics.lastDonationByUser = async function (_user) {
  return await this.findOne({ _user }).sort({ timestamp: -1 }).exec();
};

donationSchema.statics.getStats = async function (_origin) {
  const linesQry = await this.aggregate([
    {
      $group: {
        _id: { origin: "$_origin" },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const value = linesQry.reduce(
    (current, prev) => current + prev.totalAmount,
    0
  );
  const origin = linesQry.filter((line) =>
    line["_id"]["origin"].equals(_origin)
  );

  const { name: group } = await Origin.findById(origin[0]["_id"]["origin"]);
  const lineData = [
    {
      group: "Total",
      value,
    },
    {
      group,
      value: origin[0].totalAmount,
    },
  ];

  const charts = await Donation.aggregate([
    {
      $match: {
        _origin: new mongoose.Types.ObjectId(_origin),
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$donationDate",
          },
        },
        value: { $sum: "$amount" },
        _origin: { $first: "$_origin" },
      },
    },
    { $sort: { _id: 1 } },
    {
      $lookup: {
        from: "origins",
        localField: "_origin",
        foreignField: "_id",
        as: "name",
      },
    },
  ]);

  const chartsData = [];
  charts.map((chart) => {
    const { _id: date, value, name } = chart;
    const group = name[0]["name"];
    return chartsData.push({
      group,
      date,
      value,
    });
  });

  return { lineData, chartsData };
};

const Donation = mongoose.model("Donation", donationSchema);

async function validateDonationSchema(donation) {
  const schema = {
    donerId: Joi.string().required(),
    amount: Joi.number().required(),
    donationDate: Joi.date().required(),
    _origin: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    transactionType: Joi.string(),
    bcTxId: Joi.string(),
    hashFile: Joi.object(),
    hashPayload: Joi.string(),
  };

  let errorMessage = "";
  const { error } = Joi.validate(donation, schema);

  //translate common messages.
  if (error) {
    switch (error.details[0].message) {
      case '"donerId" must be a string':
        errorMessage = "El número de cliente no es válido";
        break;
      case '"donationDate" must be a number of milliseconds or valid date string':
        errorMessage = "El formato de fecha no es válido";
        break;
      default:
        errorMessage = error.details[0].message;
      // break;
    }
  }

  //
  const { donerId, amount, donationDate, _origin } = donation;

  //validar que fecha sea numerico
  if (isNaN(donationDate) || !donationDate)
    return { error: "La fecha no es válida" };

  //validar duplicado
  const duplicate = await Donation.findOne({
    donerId,
    amount,
    donationDate,
    _origin,
  }).exec();
  if (duplicate) errorMessage = "La donación ya se registró previamente";

  //validar monto mayor a cero
  if (!(amount > 0)) errorMessage = "La donación debe ser mayor a cero";

  //validar que la fecha no sea futura
  console.log("donationDate", donationDate);
  console.log("hora servidor: ", new Date().toISOString());

  if (new Date(donationDate).toISOString() > new Date().toISOString())
    errorMessage = "La fecha no puede ser futura";

  return { error: errorMessage };
}

module.exports.Donation = Donation;
module.exports.validate = validateDonationSchema;

// const updateWinner = await Donation.updateMany(
//   {
//     $and: [
//       { donationDate: { $gte: startDate } },
//       { donationDate: { $lte: endDate } },
//       { donerId: { $eq: donerId } },
//       { _origin: { $eq: _origin } },
//     ],
//   },
//   { $set: { winner: true } },
//   { multi: true }
// );
