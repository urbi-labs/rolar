const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

const Joi = require("joi");

const chuteSchema = new Schema({
    tareWeight: {
        type: Number
    },
});

const Chute = mongoose.model("Chute", chuteSchema);

function validateChuteSchema(chute) {
    const schema = {
        tareWeight: Joi.number(),
    };

    return Joi.validate(chute, schema);
}

module.exports.validate = validateChuteSchema;
module.exports.Chute = Chute;