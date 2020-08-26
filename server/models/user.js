const mongoose = require("mongoose");
const { Schema } = mongoose;

// const jwt = require("jsonwebtoken");
// const config = require("config");
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
  role: {
    type: String,
    enum: ["operator", "supervisor"],
    default: "operator",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

function validateUserSchema(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(5).max(16).required(),
  });

  return schema.validate(user);
}

module.exports.validate = validateUserSchema;
module.exports.User = User;

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     {
//       _id: this._id,
//       name: this.name,
//       mail: this.mail,
//       _origin: this._origin,
//       isAdmin: this.isAdmin,
//       isActive: this.isActive,
//     },
//     config.get("jwtPrivateKey")
//   );
//   return token;
// };

// userSchema.statics.lookup = function (_origin) {
//   return this.findById(_origin).populate("_origin", "", "Origin");
// };
