const mongoose = require("mongoose");
const { Schema } = mongoose;

const Joi = require("joi");

const chuteSchema = new Schema({
  name: { type: String, require: true },
  weight: { type: Number, default: 0 },
});

const Chute = mongoose.model("Chute", chuteSchema);

function validateChuteSchema(chute) {
  const schema = {
    name: Joi.string(),
    weight: Joi.number(),
  };

  return Joi.validate(chute, schema);
}

module.exports.validate = validateChuteSchema;
module.exports.Chute = Chute;
