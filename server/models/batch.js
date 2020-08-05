const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

// const jwt = require("jsonwebtoken");
// const config = require("config");

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const batchSchema = new Schema({
    client: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    parcel: {
        type: Number,
        required: true
    },
    oliveType: {
        type: String,
        required: true,
        trim: true
    },
    grossWeight: {
        type: Number,
        required: true
    },
    netWeight: {
        type: Number,
        required: true
    },
    deliveryNumber: {
        type: String,
        required: true,
        trim: true
    },
    receiptNumber: {
        type: String,
        required: true,
        trim: true
    },
    lastStatus: {
        type: String,
        enum: ["batch", "mill", "verticalCentrifuge", "storage"],
        required: true
    },
    validated: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    validationDate: {
        type: Date
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    _chute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chute",
        required: true
    },
    _supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Batch = mongoose.model("Batch", batchSchema);

function validateBatchSchema(batch) {
    const schema = {
        _user: Joi.objectId().required(),
        _chute: Joi.objectId().required(),
        _supervisor: Joi.objectId(),
        client: Joi.string().required(),
        parcel: Joi.number().required(),
        oliveType: Joi.string().required(),
        grossWeight: Joi.number().required(),
        netWeight: Joi.number().required(),
        deliveryNumber: Joi.number().required(),
        lastStatus: Joi.string().required(),
        validated: Joi.boolean(),
        validationDate: Joi.date(),
    };

    return Joi.validate(batch, schema);
}

module.exports.validate = validateBatchSchema;
module.exports.Batch = Batch;