const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const drawSchema = new Schema({
  name: { type: String, trim: true },
  winners: [{ type: Object, default: [] }],
  subs: [{ type: Object, default: [] }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  ballotDate: { type: Date, required: true },
  zoomDate: { type: Date, required: true },
  bcTxId: { type: String, default: "" },
  hashPayload: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
});

drawSchema.statics.currentDraw = async function () {
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  return await this.findOne({
    startDate: { $lte: today },
    ballotDate: { $gte: yesterday },
  }).sort({ endDate: 1 });
};

const Draw = mongoose.model("Draw", drawSchema);

function validateDrawSchema(draw) {
  const schema = {
    name: Joi.string().required(),
    winners: Joi.array(),
    subs: Joi.array(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    ballotDate: Joi.date().required(),
    zoomDate: Joi.date().required(),
  };

  return Joi.validate(draw, schema);
}

module.exports.Draw = Draw;
module.exports.validate = validateDrawSchema;
