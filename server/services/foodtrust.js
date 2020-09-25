const chalk = require("chalk");
const log = (text) => console.log(chalk.magentaBright("[s/foodtrust]", text));

const config = require("config");
const axios = require("axios");

const { Token } = require("../models/token");
// IAM auth data
const iam_url = config.get("IAM_URL");
const grant_type = config.get("IAM_GRANT_TYPE");
const apikey = config.get("IAM_APIKEY");

// IFT auth data
const ft_url = `${config.get("FT_AUTH_URL")}${config.get("FT_ORGID")}`;

const auth = async () => {
  let iamToken = await Token.findOne({ type: "IAM" }).exec();
  let foodtrustToken = await Token.findOne({ type: "Foodtrust" }).exec();

  if (!iamToken) {
    log("Creating new IAM token...");
    const { data } = await axios({
      method: "post",
      url: iam_url,
      params: { grant_type, apikey },
    });

    iamToken = data;
    const IAMToken = new Token({ token: iamToken });
    await IAMToken.save();
  }

  if (!foodtrustToken) {
    log("Creating new Foodtrust token...");
    try {
      const { data } = await axios({
        method: "post",
        url: ft_url,
        data: iamToken,
      });
      foodtrustToken = data;
    } catch (error) {
      console.log(error.response);
    }

    const FTToken = new Token({ token: foodtrustToken, type: "Foodtrust" });
    foodtrustToken = await FTToken.save();
    log("New Foodtrust token stored.");
  }

  const { token } = foodtrustToken;
  const { onboarding_token } = token;
  return onboarding_token;
};

const srvAssets = async (xml) => {
  const onboarding_token = await auth();

  const headers = {
    "IFT-Entitlement-Mode": "default",
    Accept: "application/json",
    "Content-Type": "application/xml",
    Authorization: "Bearer " + onboarding_token,
  };
  const url = config.get("FT_ASSETS_URL");

  log("Sending new asset info", xml);
  try {
    const data = await axios({
      method: "post",
      url,
      headers,
      data: xml,
    });

    return data;
  } catch (error) {
    if (error.response) {
      const response = error.response;
      const { data } = response;
      const { message } = data;
      console.log(message);
      return response;
    }
  }
};

exports.auth = auth;
exports.srvAssets = srvAssets;
