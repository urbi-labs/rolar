const mongoose = require("mongoose");
const { Schema } = mongoose;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const tankSchema = new Schema({
  name: { type: String, required: true, trim: true },
  cone: { type: Number, required: true },
  capacity: { type: Number, required: true },
  radius: { type: Number, required: true },
  active: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
});

const Tank = mongoose.model("Tank", tankSchema);

function validateTankSchema(tank) {
  const schema = Joi.object({
    name: Joi.string().required(),
    cone: Joi.number().required(),
    capacity: Joi.number().required(),
    radius: Joi.number().required(),
    active: Joi.boolean(),
  });

  return schema.validate(tank);
}

module.exports.validate = validateTankSchema;
module.exports.Tank = Tank;
