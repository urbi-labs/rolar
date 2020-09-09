const mongoose = require("mongoose");
const {
  Schema
} = mongoose;
const {
  ObjectId
} = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const verticalCentrifugeSchema = new Schema({
  _batch: {
    type: ObjectId,
    ref: "Batch",
    required: true,
  },
  _user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  _supervisor: {
    type: ObjectId,
    ref: "User",
  },
  production_line: {
    type: String,
    required: true,
    trim: true
  },
  initialTemp: {
    type: Number,
    required: true
  },
  finalTemp: {
    type: Number,
    required: true
  },
  kneadingTime: {
    type: Number,
    required: true
  },
  pumpSpeed: {
    type: Number,
    required: true
  },
  validated: {
    type: Boolean,
    default: false
  },
  validationDate: {
    type: Date
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
});

const VerticalCentrifuge = mongoose.model("VerticalCentrifuge", verticalCentrifugeSchema);

function validateVerticalCentrifugeSchema(verticalCentrifuge) {
  const schema = Joi.object({
    _batch: Joi.objectId().required(),
    _user: Joi.objectId().required(),
    production_line: Joi.string().required(), // Es la misma que la otra? habría que unificar nombres?
    initialTemp: Joi.number().required(),
    finalTemp: Joi.number().required(),
    kneadingTime: Joi.number().required(),
    pumpSpeed: Joi.number().required(),
  });

  return schema.validate(verticalCentrifuge);
}

module.exports.validate = validateVerticalCentrifugeSchema;
module.exports.VerticalCentrifuge = VerticalCentrifuge;