const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const verticalCentrifugeSchema = new Schema({
  _batch: {
    type: ObjectId,
    ref: "Batch",
    required: true,
  },
  _user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  _supervisor: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  production_line: { type: String, required: true, trim: true },
  initialTemp: { type: Number, required: true },
  mummified: { type: Number, required: true },
  finalTemp: { type: Number, required: true },
  kneadingTime: { type: Number, required: true },
  pumpSpeed: { type: Number, required: true },
  validated: { type: Boolean, default: false },
  validationDate: { type: Date },
  timestamp: { type: Date, default: Date.now },
});

const VerticalCentrifuge = mongoose.model("VerticalCentrifuge", verticalCentrifugeSchema);

function validateVerticalCentrifugeSchema(verticalCentrifuge) {
  const schema = {
    _batch: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    _supervisor: Joi.objectId().required(),
    validated: Joi.boolean(),
    production_line: Joi.string().required(),
    initialTemp: Joi.number().required(),
    mummified: Joi.number().required(),
    finalTemp: Joi.number().required(),
    kneadingTime: Joi.number().required(),
    pumpSpeed: Joi.number().required(),
    validationDate: Joi.date(),
  };

  return Joi.validate(verticalCentrifuge, schema);
}

module.exports.validate = validateVerticalCentrifugeSchema;
module.exports.VerticalCentrifuge = VerticalCentrifuge;
