const auth = require("../middleware/auth");

const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const multer = require("multer");
const csv = require("csvtojson");
const path = require("path");
const cwd = process.cwd();
const fs = require("fs");

const upload = multer({ dest: path.join(cwd, "temp") });

router.post("/bulk", [upload.single("files"), auth], async (req, res) => {
  const { col } = req.body;
  const { path } = req.file;

  const jsonArray = await csv({
    noheader: true,
    output: "csv",
  }).fromFile(path);

  console.log("jsonArray", jsonArray);

  if (col === "users") {
    jsonArray.map(async (line) => {
      const csvArray = line[0].split(";");
      try {
        const user = new User({
          _hospital: csvArray[0] ? csvArray[0].split(",") : [],
          name: csvArray[1],
          dni: csvArray[2],
          email: csvArray[3],
          password: csvArray[2],
          _type: csvArray[4],
          isAdmin: csvArray[5] ? true : false,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        console.log(user.password);
        await user.save();
        console.log("user saved:", csvArray[0]);
      } catch (error) {
        console.log("user failed:", csvArray[0]);
        console.log(error);
      }
    });
  }

  //elimino temp file
  await fs.unlinkSync(path);

  return res.status(200).send(jsonArray);
});

module.exports = router;
