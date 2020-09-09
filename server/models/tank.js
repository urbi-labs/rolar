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
  const schema = Joi.object({
    description: Joi.string().required(),
    active: Joi.boolean(),
    capacity: Joi.number().required(),
  });

  return schema.validate(tank);
}

module.exports.validate = validateTankSchema;
module.exports.Tank = Tank;
