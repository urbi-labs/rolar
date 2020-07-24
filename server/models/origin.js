const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = mongoose;

const originSchema = new Schema({
  name: { type: String, unique: true, required: true, trim: true },
  timestamp: { type: Date, default: Date.now },
});

const Origin = mongoose.model("Origin", originSchema);

function validateOriginSchema(value) {
  const schema = {
    name: Joi.string().required(),
  };

  return Joi.validate(value, schema);
}

module.exports.Origin = Origin;
module.exports.validate = validateOriginSchema;
