const chalk = require("chalk");
const log = (text) => console.log(chalk.magentaBright("[s/foodtrust]", text));

const config = require("config");
const axios = require("axios");
const { getToken, setToken } = require("./redisdb");

const iam_url = config.get("IAM_URL");
const apikey = config.get("IAM_APIKEY");
const grant_type = config.get("IAM_GRANT_TYPE");
const ft_url = `${config.get("FT_AUTH_URL")}${config.get("FT_ORGID")}`;
const ft_orgId = config.get("FT_ORGID");
const facilityFilter = config.get("FILTER_FACILITY");
const itemFilter = config.get("FILTER_ITEM");

auth = async () => {
  let iamToken = JSON.parse(await getToken("IAMAccessToken"));
  let foodtrustToken = JSON.parse(await getToken("FoodtrustAccessToken"));

  if (!iamToken) {
    const { data } = await axios({
      method: "post",
      url: iam_url,
      params: { grant_type, apikey },
    });
    iamToken = data;
    const { expires_in } = iamToken;
    await setToken("IAMAccessToken", JSON.stringify(iamToken), expires_in);
  }

  if (!foodtrustToken) {
    console.log("auth: before axios!!!!");
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

    console.log("auth: after axios!!!!");

    await setToken(
      "FoodtrustAccessToken",
      JSON.stringify(foodtrustToken),
      60 * 60 * 3
    );
    console.log("auth: FT OK!!!!");
  }

  return foodtrustToken;
};

srvAssets = async (xml) => {
  const { onboarding_token } = await auth();

  const headers = {
    "IFT-Entitlement-Mode": "default",
    Accept: "application/json",
    "Content-Type": "application/xml",
    Authorization: "Bearer " + onboarding_token,
  };
  const url = config.get("FT_ASSETS_URL");

  log("Sending new asset info", xml);
  const data = await axios({
    method: "post",
    url,
    headers,
    data: xml,
  });

  return data;
};

srvTraces = async (epc) => {
  const { onboarding_token } = await auth();

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/xml",
    Authorization: "Bearer " + onboarding_token,
  };

  const baseURL = config.get("FT_TRACE_URL_BASE");
  const ep = config.get("FT_TRACE_URL_EP");
  const url = `${baseURL}/epcs/${epc}${ep}`;

  log("Sending trace... ", epc);
  const data = await axios({
    method: "get",
    url,
    headers,
  });
  return data;
};

consumer_events = async () => {
  const { onboarding_token } = await auth();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/xml",
    Authorization: "Bearer " + onboarding_token,
  };

  const baseURL = config.get("FT_TRACE_URL_BASE");
  const url = `${baseURL}/events`;

  log("consumer_events... ", url);
  const data = await axios({
    method: "get",
    url,
    headers,
  });
  return data;
};

srvLots = async (limit, start) => {
  const { onboarding_token } = await auth();

  console.log("srvLots checkpoint");

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/xml",
    Authorization: "Bearer " + onboarding_token,
  };

  const baseURL = config.get("FT_TRACE_URL_BASE");
  const url = `${baseURL}/lots_and_serials`;
  console.log(baseURL);
  console.log(url);
  const params = {
    limit,
  };

  // if (start) params.start = start;

  const { data } = await axios({
    method: "get",
    url,
    headers,
    params,
  });
  console.log("lalala", data);

  return data;
};

srvItems = async () => {
  const { onboarding_token } = await auth();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/xml",
    Authorization: "Bearer " + onboarding_token,
  };

  const baseURL = config.get("FT_TRACE_URL_BASE");
  const url = `${baseURL}/products`;

  log("srvItems... ", url);
  const { data } = await axios({
    method: "get",
    url: `${url}?description=${itemFilter}`,
    headers,
  });

  const { products: filter } = data;

  // const filter = products.filter(item => item["description"].includes("IG"));

  return filter;
};

srvLocations = async () => {
  const { onboarding_token } = await auth();
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/xml",
    Authorization: "Bearer " + onboarding_token,
  };

  const baseURL = config.get("FT_TRACE_URL_BASE");
  const url = `${baseURL}/locations`;

  log("srvLocations...", url);
  const { data } = await axios({
    method: "get",
    url: `${url}?org_id=${ft_orgId}`, //Este filtro hay que sacarlo en la implementación final
    headers,
  });

  log("This filter will not be required on LATAM account");
  const { locations } = data;
  const filter = locations.filter((location) =>
    location["party_name"].includes(facilityFilter)
  );

  return filter;
};

exports.auth = auth;
exports.srvAssets = srvAssets;
exports.srvTraces = srvTraces;
exports.consumer_events = consumer_events;
exports.srvLots = srvLots;
exports.srvItems = srvItems;
exports.srvLocations = srvLocations;
