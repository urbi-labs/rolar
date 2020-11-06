const mongoose = require("mongoose");

const { Tank } = require("../models/tank");
const { Batch } = require("../models/batch");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const storageSchema = new Schema({
  _batch: { type: ObjectId, ref: "Batch", required: true },
  _user: { type: ObjectId, ref: "User", required: true },
  _tank: { type: ObjectId, ref: "Tank", required: true },
  _supervisor: { type: ObjectId, ref: "User" },
  cone: { type: Boolean, default: false },
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

storageSchema.statics.calcTotals = async (storage) => {
  let { _batch, _tank, initialMeasure, finalMeasure } = storage;

  //lookup tank cone property
  const tank = await Tank.findById(_tank);

  const { cone, radius } = tank;

  finalMeasure = finalMeasure || 0;
  initialMeasure = initialMeasure || 0;

  storage.totalCm = finalMeasure - initialMeasure;
  const { totalCm } = storage;

  storage.totalLitres =
    cone + Math.PI * ((Math.pow(radius / 1000, 2) * totalCm) / 1000) * 1000;

  const { totalLitres } = storage;
  storage.oilWeight = totalLitres * 0.92;

  const batch = await Batch.findById(_batch);
  const { netWeight } = batch;
  const { oilWeight } = storage;
  storage.performance = oilWeight / netWeight;
};

const Storage = mongoose.model("Storage", storageSchema);

function validateStorageSchema(storage) {
  const schema = Joi.object({
    _batch: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    _tank: Joi.objectId().required(),
    initialMeasure: Joi.number(),
    finalMeasure: Joi.number(),
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
