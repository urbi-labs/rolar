const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const centrifugeSchema = new Schema({
  _batch: { type: ObjectId, ref: "Batch", required: true },
  _user: { type: ObjectId, ref: "User", required: true },
  _tank: { type: ObjectId, ref: "Tank", required: true },
  _supervisor: { type: ObjectId, ref: "User" },
  productionLine: { type: String, required: true, trim: true },
  initialTemp: { type: Number, required: true },
  finalTemp: { type: Number, required: true },
  kneadingTime: { type: Number, required: true },
  pumpSpeed: { type: Number, required: true },
  validated: { type: Boolean, default: false },
  validationDate: { type: Date },
  timestamp: { type: Date, default: Date.now },
});

const Centrifuge = mongoose.model("Centrifuge", centrifugeSchema);

function validateCentrifugeSchema(centrifuge) {
  const schema = Joi.object({
    _batch: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    _tank: Joi.objectId().required(),
    productionLine: Joi.string().required(), // Es la misma que la otra? habría que unificar nombres?
    initialTemp: Joi.number().required(),
    finalTemp: Joi.number().required(),
    kneadingTime: Joi.number().required(),
    pumpSpeed: Joi.number().required(),
  });

  return schema.validate(centrifuge);
}

module.exports.validate = validateCentrifugeSchema;
module.exports.Centrifuge = Centrifuge;
