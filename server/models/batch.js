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
        id: Joi.Number().require(),
        client: Joi.String().require(),
        parcel: Joi.Number().require(),
        oliveType: Joi.String().require(),
        _chute: Joi.Schema().require(),
        grossWeight: Joi.Number().require(),
        netWeight: Joi.Number().require(),
        deliveryNumber: Joi.Number().require(),
        lastStatus: Joi.String().require(),
        user_: Joi.Schema().require(),
        validated: Joi.Boolean(),
        validationDate: Joi.Date(),
        _supervisor: Joi.Schema(),
    };

    return Joi.validate(batch, schema);
}

module.exports.validate = validateBatchSchema;
module.exports.Batch = Batch;