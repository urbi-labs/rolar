const mongoose = require("mongoose");
const { Schema } = mongoose;

const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new Schema({
  name: {
    type: String,
    uppercase: true,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlenght: 16,
    required: true,
    trim: true,
  },
  role: { type: String, default: "operator", trim: true },
  timestamp: { type: Date, default: Date.now },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      role: this.role,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUserSchema(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(5).max(16).required(),
    role: Joi.string(),
  });

  return schema.validate(user);
}

module.exports.validate = validateUserSchema;
module.exports.User = User;

// userSchema.statics.lookup = function (_origin) {
//   return this.findById(_origin).populate("_origin", "", "Origin");
// };
