const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const tankClosureSchema = new Schema({
    _tank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tank",
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
    batchArray: {
        type: Array
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

const TankClosure = mongoose.model("TankClosure", tankClosureSchema);

function validateTankClosureSchema(tankClosure) {
    const schema = {
        _tank: Joi.objectId(),
        _user: Joi.objectId(),
        _supervisor: Joi.objectId(),
        batchArray: Joi.array(),
        validationDate: Joi.boolean(),
        validationDate: Joi.date()
    };

    return Joi.validate(tankClosure, schema);
}

module.exports.validate = validateTankClosureSchema;
module.exports.TankClosure = TankClosure;