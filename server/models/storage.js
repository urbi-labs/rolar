const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const storageSchema = new Schema({
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
  _tank: {
    type: ObjectId,
    ref: "Tank",
    required: true,
  },
  _supervisor: {
    type: ObjectId,
    ref: "User",
  },
  cone: { type: Boolean, default: true },
  initialMeasure: { type: Number, default: 0, required: true },
  finalMeasure: { type: Number, default: 0, required: true },
  totalCm: { type: Number, default: 0, required: true },
  totalLitres: { type: Number, default: 0, required: true },
  oilWeight: { type: Number, default: 0, required: true },
  performance: { type: Number, default: 0, required: true },
  validated: { type: Boolean, default: false },
  validationDate: { type: Date },
  timestamp: { type: Date, default: Date.now },
});

const Storage = mongoose.model("Storage", storageSchema);

function validateStorageSchema(storage) {
  const schema = Joi.object({
    _batch: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    _tank: Joi.objectId().required(),
    initialMeasure: Joi.number().required(),
    finalMeasure: Joi.number().required(),
    totalCm: Joi.number(),
    totalLitres: Joi.number(),
    oilWeight: Joi.number(),
    performance: Joi.number(),
    cone: Joi.boolean(),
    validated: Joi.boolean(),
    validationDate: Joi.date(),
  });

  return schema.validate(storage);
}

module.exports.validate = validateStorageSchema;
module.exports.Storage = Storage;
