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
    required: true,
  },
  cone: { type: String, required: true, trim: true },
  initialMeasure: { type: Number, required: true },
  finalMeasure: { type: Number, required: true },
  totalCm: { type: Number, required: true },
  totalLitres: { type: Number, required: true },
  oilWeight: { type: Number, required: true },
  performance: { type: Number, required: true },
  validated: { type: Boolean, default: false },
  validationDate: { type: Date },
  timestamp: { type: Date, default: Date.now },
});

const Storage = mongoose.model("Storage", storageSchema);

function validateStorageSchema(storage) {
  const schema = Joi.object({
    _batch: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    _supervisor: Joi.objectId().required(),
    _tank: Joi.objectId().required(),
    validated: Joi.boolean(),
    validationDate: Joi.date(),
    cone: Joi.string().required(),
    initialMeasure: Joi.number().required(),
    finalMeasure: Joi.number().required(),
    totalCm: Joi.number().required(),
    totalLitres: Joi.number().required(),
    oilWeight: Joi.number().required(),
    performance: Joi.number().required(),
  };

  return schema.validate(storage);
}

module.exports.validate = validateStorageSchema;
module.exports.Storage = Storage;
