const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const batchSchema = new Schema({
  _user: { type: ObjectId, ref: "User", required: true },
  client: { type: String, required: true, trim: true },
  parcel: { type: Number, required: true },
  oliveType: { type: String, required: true, trim: true },
  tookSample: { type: Boolean, default: false },
  chuteName: { type: String, require: true },
  chuteWeight: { type: Number, default: 0 },
  grossWeight: { type: Number, required: true },
  netWeight: { type: Number, required: true },
  deliveryNumber: { type: String, required: true, trim: true },
  receiptNumber: { type: String, required: true, trim: true },
  lastStatus: { type: String, required: true, default: "batch" },
  _supervisor: { type: ObjectId, ref: "User" },
  validated: { type: Boolean, default: false },
  validationDate: { type: Date },
  timestamp: { type: Date, default: Date.now },
});

batchSchema.statics.calcNetWeight = async (batch) => {
  let { chuteWeight, grossWeight } = batch;

  batch.netWeight = grossWeight - chuteWeight;
};

const Batch = mongoose.model("Batch", batchSchema);

function validateBatchSchema(batch) {
  const schema = Joi.object({
    _user: Joi.objectId().required(),
    client: Joi.string().required(),
    parcel: Joi.number().required(),
    oliveType: Joi.string().required(),
    chuteName: Joi.string().required(),
    chuteWeight: Joi.number().required(),
    grossWeight: Joi.number().required(),
    netWeight: Joi.number(),
    deliveryNumber: Joi.string().required(),
    receiptNumber: Joi.string().required(),
  });

  return schema.validate(batch);
}

module.exports.validate = validateBatchSchema;
module.exports.Batch = Batch;
