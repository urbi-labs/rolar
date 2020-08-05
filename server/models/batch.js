const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

// const jwt = require("jsonwebtoken");
// const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const batchSchema = new Schema({
    id: {
        type: Number
            /*esta bien?*/
            ,
        required: true,
        trim: true
    },
    client: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    parcel: {
        type: Number,
        required: true,
        trim: true,
    },
    oliveType: {
        type: String,
        required: true,
        trim: true
    },
    grossWeight: {
        type: Number,
        required: true,
        trim: true,
    },
    netWeight: {
        type: Number,
        required: true,
        trim: true,
    },
    deliveryNumber: {
        type: Number,
        required: true,
        trim: true,
    },
    receiptNumber: {
        type: Number,
        required: true,
        trim: true,
    },
    lastStatus: {
        type: String,
        enum: ["batch", "mill", "verticalCentrifuge", "storage"],
        trim: true,
        required: true,
    },
    validated: {
        type: Boolean,
        default: false, // esta bien?
    },
    validationDate: {
        type: Date,
        default: Date.now
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    _chute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chute",
        required: true,
    },
    _supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

});

const Batch = mongoose.model("Batch", batchSchema);

function validateBatchSchema(batch) {
    const schema = {
        id: Joi.Number().required(),
        client: Joi.String().required(),
        parcel: Joi.Number().required(),
        oliveType: Joi.String().required(),
        _chute: Joi.Schema().required(),
        grossWeight: Joi.Number().required(),
        netWeight: Joi.Number().required(),
        deliveryNumber: Joi.Number().required(),
        lastStatus: Joi.String().required(),
        user_: Joi.Schema().required(),
        validated: Joi.Boolean(),
        validationDate: Joi.Date(),
        _supervisor: Joi.Schema(),
    };

    return Joi.validate(batch, schema);
}

module.exports.validate = validateBatchSchema;
module.exports.Batch = Batch;