const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const tankClosureSchema = new Schema({
  _tank: { type: ObjectId, ref: "Tank", required: true },
  _user: { type: ObjectId, ref: "User", required: true },
  _supervisor: { type: ObjectId, ref: "User" },
  batchArray: { type: Array },
  validated: { type: Boolean },
  validationDate: { type: Date },
  timestamp: { type: Date, default: Date.now },
});

const TankClosure = mongoose.model("TankClosure", tankClosureSchema);

function validateTankClosureSchema(tankClosure) {
  const schema = Joi.object({
    _tank: Joi.objectId(),
    _user: Joi.objectId(),
    _supervisor: Joi.objectId(),
    batchArray: Joi.array(),
    validated: Joi.boolean(),
    validationDate: Joi.date(),
  });

  return schema.validate(tankClosure);
}

module.exports.validate = validateTankClosureSchema;
module.exports.TankClosure = TankClosure;
