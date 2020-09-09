const auth = require("../middleware/auth");
const {
    validate,
    VerticalCentrifuge
} = require("../models/verticalCentrifuge");
const express = require("express");
const router = express.Router();

router.post("/", auth, async (req, res) => {
    const {
        body
    } = req;

    const {
        error
    } = validate(body);
    if (error) return res.status(400).send(error.details[0].message);

    const verticalCentrifuge = new VerticalCentrifuge({
        ...body
    });
    await verticalCentrifuge.save();

    return res.status(200).send(verticalCentrifuge);
});

router.get("/", auth, async (req, res) => {
    const verticalCentrifuges = await VerticalCentrifuge.find().sort({
        timestamp: "desc"
    });
    res.send(verticalCentrifuges);
});

module.exports = router;