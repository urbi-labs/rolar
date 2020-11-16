const chalk = require("chalk");
const log = (text) => console.log(chalk.cyan.bgBlack("[xmlMsgs]", text));

const config = require("config");
const fs = require("fs").promises;
const util = require("util");
const path = require("path");
const cwd = process.cwd();

const uuidv1 = require("uuid/v1");
const xml2js = require("xml2js");
const parseString = util.promisify(xml2js.parseString);

// const { exp, sellBy, best, lot } = require("../XMLMessages/XML_Tags.json");
// const {
//   farmId: fid,
//   farmList: fl,
//   farm: f,
// } = require("../XMLMessages/XML_Tags.json");

const { LFTPI, FTLI } = require("../XMLMessages/GS1_Patterns.json");
const { UUID, DISP, SSCC } = require("../XMLMessages/GS1_Patterns.json");

const PREFIX = config.get("FT_COMPANY_PREFIX");

const epcisCommission = async (values) => {
  const {
    epcis_root: r,
    epcis_body: b,
    epcis_eventList: el,
    epcis_objectEvent: oe,
    epcis_quantityList: ql,
    epcis_extension: e,
    epcis_quantityElement: qe,
    // epcis_destinationList: dl,
  } = require("../XMLMessages/XML_Tags.json");

  const { item_ref, item_lot, item_qty, eventTime } = values;
  const { biz_loc } = values; //src_loc, dest_loc
  // const { date_exp, date_sellby, date_best } = values;

  const xmlFilePath = path.join(cwd, "server/XMLMessages", "epcis_com.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  const epcClass = `${LFTPI}:${PREFIX}.${item_ref}.${item_lot}`;
  const location = `${FTLI}:${PREFIX}.${biz_loc}`;

  log("item_ref: " + item_ref);
  log("item_lot: " + item_lot);
  log("epcClass: " + epcClass);
  log(`location: ${FTLI}:${PREFIX}.${biz_loc}`);

  xml[r][b][0][el][0][oe][0].eventTime[0] = eventTime; // new Date().toISOString();
  xml[r][b][0][el][0][oe][0].baseExtension[0].eventID = `${UUID}:${uuidv1()}`;
  xml[r][b][0][el][0][oe][0].bizLocation[0].id = location;
  xml[r][b][0][el][0][oe][0][e][0][ql][0][qe][0].epcClass = epcClass;
  xml[r][b][0][el][0][oe][0][e][0][ql][0][qe][0].quantity = item_qty;
  // xml[r][b][0][el][0][oe][0][e][0].sourceList[0]._ = src_loc;
  // xml[r][b][0][el][0][oe][0][e][0][dl][0]._ = dest_loc;
  // xml[r][b][0][el][0][oe][0][e][0].ilmd[0][exp] = date_exp;
  // xml[r][b][0][el][0][oe][0][e][0].ilmd[0][sellBy] = date_sellby;
  // xml[r][b][0][el][0][oe][0][e][0].ilmd[0][best] = date_best;
  // xml[r][b][0][el][0][oe][0][e][0].ilmd[0][fl][0][f][0][fid][0] = location;
  // xml[r][b][0][el][0][oe][0][e][0].ilmd[0][lot][0] = item_lot;

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

  console.log(outputXml);
  return outputXml;
};

const epcisTransformation = async (values) => {
  const {
    epcis_root: r,
    epcis_body: b,
    epcis_eventList: el,
    epcis_extension: e,
    epcis_quantityElement: qe,
    epcis_TransformationEvent: te,
    epcis_inputQuantityList: iql,
    epcis_outputQuantityList: oql,
    epcis_baseExtension: be,
  } = require("../XMLMessages/XML_Tags.json");

  const {
    item_ref_in,
    item_lot_in,
    item_ref_out,
    item_lot_out,
    eventTime,
  } = values;

  const { item_qty_in, item_qty_out } = values;
  const { biz_loc } = values;
  // const { date_exp, date_sellby, date_best } = values;

  const xmlFilePath = path.join(cwd, "server/XMLMessages", "epcis_trn.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  const location = `${FTLI}:${PREFIX}.${biz_loc}`;
  const epcClassIn = `${LFTPI}:${PREFIX}.${item_ref_in}.${item_lot_in}`;
  const epcClassOut = `${LFTPI}:${PREFIX}.${item_ref_out}.${item_lot_out}`;

  log("epcClassIn: " + epcClassIn);
  log("item_qty_in: " + item_qty_in);
  log("epcClassOut: " + epcClassOut);
  log("item_qty_out: " + item_qty_out);
  log(`location: ${FTLI}:${PREFIX}.${biz_loc}`);

  xml[r][b][0][el][0][e][0][te][0].eventTime[0] = eventTime;
  xml[r][b][0][el][0][e][0][te][0][be][0].eventID = `${UUID}:${uuidv1()}`;
  xml[r][b][0][el][0][e][0][te][0][iql][0][qe][0].epcClass = epcClassIn;
  xml[r][b][0][el][0][e][0][te][0][iql][0][qe][0].quantity = item_qty_in;
  xml[r][b][0][el][0][e][0][te][0][oql][0][qe][0].epcClass = epcClassOut;
  xml[r][b][0][el][0][e][0][te][0][oql][0][qe][0].quantity = item_qty_out;
  xml[r][b][0][el][0][e][0][te][0].bizLocation[0].id = location;

  // xml[r][b][0][el][0][e][0][te][0][e][0].ilmd[0][exp] = date_exp;
  // xml[r][b][0][el][0][e][0][te][0][e][0].ilmd[0][sellBy] = date_sellby;
  // xml[r][b][0][el][0][e][0][te][0][e][0].ilmd[0][best] = date_best;

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

  console.log(outputXml);
  return outputXml;
};

const epcisObservation = async (values) => {
  const {
    epcis_root: r,
    epcis_body: b,
    epcis_eventList: el,
    epcis_objectEvent: oe,
    epcis_quantityList: ql,
    epcis_extension: e,
    epcis_quantityElement: qe,
    epcis_destinationList: dl,
  } = require("../XMLMessages/XML_Tags.json");

  const { item_ref, item_qty, item_lot } = values;
  const { biz_loc, item_disp } = values;

  const xmlFilePath = path.join(cwd, "server/XMLMessages", "epcis_obs.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  const location = `${FTLI}:${PREFIX}.${biz_loc}`;
  const epcClass = `${LFTPI}:${PREFIX}.${item_ref}.${item_lot}`;

  log("epcClass: " + epcClass);
  log(`location: ${FTLI}:${PREFIX}.${biz_loc}`);

  xml[r][b][0][el][0][oe][0].eventTime[0] = new Date().toISOString();
  xml[r][b][0][el][0][oe][0].baseExtension[0].eventID = `${UUID}:${uuidv1()}`;
  xml[r][b][0][el][0][oe][0].disposition = `${DISP}:${item_disp}`;
  xml[r][b][0][el][0][oe][0].bizLocation[0].id = location;
  xml[r][b][0][el][0][oe][0][e][0][ql][0][qe][0].epcClass = epcClass;
  xml[r][b][0][el][0][oe][0][e][0][ql][0][qe][0].quantity = item_qty;

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

  console.log(outputXml);
  return outputXml;
};

const epcisAggregation = async (values) => {
  const {
    epcis_root: r,
    epcis_body: b,
    epcis_eventList: el,
    epcis_childqtylist: ql,
    epcis_extension: e,
    epcis_quantityElement: qe,
    epcis_aggregation: ea,
  } = require("../XMLMessages/XML_Tags.json");

  const { item_ref, item_lot, item_qty } = values;
  const { pallet, biz_loc, eventTime, batchArray } = values;

  const xmlFilePath = path.join(cwd, "server/XMLMessages", "epcis_agg.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  const location = `${FTLI}:${PREFIX}.${biz_loc}`;
  const epcClass = `${LFTPI}:${PREFIX}.${item_ref}.${item_lot}`;
  const palletId = `${SSCC}:${PREFIX}.${pallet}`;

  log("epcClass: " + epcClass);
  log(`location: ${FTLI}:${PREFIX}.${biz_loc}`);
  log("palletId: " + palletId);

  xml[r][b][0][el][0][ea][0].eventTime[0] = eventTime;
  xml[r][b][0][el][0][ea][0].baseExtension[0].eventID = `${UUID}:${uuidv1()}`;
  xml[r][b][0][el][0][ea][0].parentID = palletId;
  xml[r][b][0][el][0][ea][0].bizLocation[0].id = location;

  console.log(batchArray);
  // xml[r][b][0][el][0][ea][0][e][0][ql][0][qe][0].epcClass = epcClass;
  // xml[r][b][0][el][0][ea][0][e][0][ql][0][qe][0].quantity = item_qty;

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

  console.log(outputXml);
  return outputXml;
};

exports.epcisCommission = epcisCommission;
exports.epcisTransformation = epcisTransformation;
exports.epcisObservation = epcisObservation;
exports.epcisAggregation = epcisAggregation;
