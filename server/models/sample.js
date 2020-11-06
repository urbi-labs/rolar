const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const sampleSchema = new Schema({
  _batch: { type: ObjectId, ref: "Batch", required: true },
  _user: { type: ObjectId, ref: "User", required: true },
  _supervisor: { type: ObjectId, ref: "User" },
  hidraulicOil: { type: Boolean, default: false },
  frost: { type: Number, default: 0 },
  mummified: { type: Number, default: 0 },
  dehydrated: { type: Number, default: 0 },
  beaten: { type: Number, default: 0 },
  waterExcess: { type: Number, default: 0 },
  branchExcess: { type: Number, default: 0 },
  leafExcess: { type: Number, default: 0 },
  maturityIndex: { type: Number, default: 0 },
  moisturePase: { type: Number, default: 0 },
  wetFat: { type: Number, default: 0 },
  dryFat: { type: Number, default: 0 },
  taurusPomace: { type: Number, default: 0 },
  rexPomace: { type: Number, default: 0 },
  validated: { type: Boolean, default: false },
  validationDate: { type: Date },
  timestamp: { type: Date, default: Date.now },
});

const Sample = mongoose.model("Sample", sampleSchema);

function validateSampleSchema(sample) {
  const schema = Joi.object({
    _batch: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    hidraulicOil: Joi.boolean(),
    frost: Joi.number().min(0).max(100),
    beaten: Joi.number().min(0).max(100),
    mummified: Joi.number().min(0).max(100),
    dehydrated: Joi.number().min(0).max(100),
    waterExcess: Joi.number().min(0).max(100),
    branchExcess: Joi.number().min(0).max(100),
    leafExcess: Joi.number().min(0).max(100),
    maturityIndex: Joi.number().min(0).max(7),
    moisturePase: Joi.number().min(0).max(100),
    wetFat: Joi.number().min(0).max(100),
    dryFat: Joi.number().min(0).max(100),
    taurusPomace: Joi.number().min(0).max(100),
    rexPomace: Joi.number().min(0).max(100),
  });

  return schema.validate(sample);
}

module.exports.validate = validateSampleSchema;
module.exports.Sample = Sample;
