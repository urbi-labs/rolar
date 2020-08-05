const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const millSchema = new Schema({
    _batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true,
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    _supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productLine: {
        type: String
    },
    sieve: {
        type: String
    },
    microtalcum: {
        type: Number
    },
    enzymes: {
        type: Number
    },
    validated: {
        type: Boolean
    },
    validationDate: {
        type: Date
    },
    //Le agregué el timestamp
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Mill = mongoose.model("Mill", millSchema);

function validateBatchSchema(batch) {
    const schema = {
        _batch: Joi.objectId(),
        _user: Joi.objectId(),
        _supervisor: Joi.objectId(),
        productLine: Joi.string(),
        sieve: Joi.string(),
        microtalcum: Joi.number(),
        enzymes: Joi.number(),
        validate: Joi.boolean(),
        validationDate: Joi.date(),
    };

    return Joi.validate(batch, schema);
}

module.exports.validate = validateBatchSchema;
module.exports.Batch = Batch;