const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const millSchema = new Schema({
  _batch: { type: ObjectId, ref: "Batch", required: true },
  _user: { type: ObjectId, ref: "User", required: true },
  _supervisor: { type: ObjectId, ref: "User" },
  productionLine: { type: String },
  sieve: { type: String },
  microtalcum: { type: Number, default: 0 },
  enzymes: { type: Number },
  validated: { type: Boolean, default: false },
  validationDate: { type: Date },

  timestamp: { type: Date, default: Date.now },
});

const Mill = mongoose.model("Mill", millSchema);

function validateMillSchema(mill) {
  const schema = Joi.object({
    _batch: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    productionLine: Joi.string().required(),
    sieve: Joi.string().required(),
    microtalcum: Joi.number().min(0).max(1),
    enzymes: Joi.number().required(),
  });

  return schema.validate(mill);
}

module.exports.validate = validateMillSchema;
module.exports.Mill = Mill;
