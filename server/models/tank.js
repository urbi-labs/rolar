const mongoose = require("mongoose");
const { Schema } = mongoose;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const tankSchema = new Schema({
  description: { type: String, required: true, trim: true },
  active: { type: Boolean, default: false },
  capacity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Tank = mongoose.model("Tank", tankSchema);

function validateTankSchema(tank) {
  const schema = {
    description: Joi.string().required(),
    active: Joi.boolean(),
    capacity: Joi.number().required(),
  };

  return Joi.validate(tank, schema);
}

module.exports.validate = validateTankSchema;
module.exports.Tank = Tank;
