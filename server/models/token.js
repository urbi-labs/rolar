const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

const tokenSchema = new Schema({
  token: { type: Object, required: true },
  type: { type: String, default: "IAM" },
  createdAt: { type: Date, default: Date.now },
});

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

const Token = mongoose.model("Token", tokenSchema);

function validateToken(token) {
  const schema = {
    token: Joi.object().required(),
  };

  return Joi.validate(token, schema);
}
module.exports.Token = Token;
module.exports.validateToken = validateToken;
