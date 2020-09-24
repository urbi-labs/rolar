const chalk = require("chalk");
const log = (text) => console.log(chalk.cyan.bgBlack("[xmlMsgs]", text));

const config = require("config");
const uuidv1 = require("uuid/v1");
const fs = require("fs").promises;
const util = require("util");
const path = require("path");
const cwd = process.cwd();

const xml2js = require("xml2js");
const parseString = util.promisify(xml2js.parseString);

const { header, sender, receiver } = require("../XMLMessages/XML_Tags.json");
const { docId, instance, date, id } = require("../XMLMessages/XML_Tags.json");
const { exp, sellBy, best, lot } = require("../XMLMessages/XML_Tags.json");
const {
  farmId: fid,
  farmList: fl,
  farm: f,
} = require("../XMLMessages/XML_Tags.json");

const { FTPI, FTLI } = require("../XMLMessages/GS1_Patterns.json");
const { LFTPI, FTLPN } = require("../XMLMessages/GS1_Patterns.json");
const { UUID, DISP } = require("../XMLMessages/GS1_Patterns.json");

const PREFIX = config.get("FT_COMPANY_PREFIX");

const mdItem = async (values) => {
  const {
    item_root: r,
    epcis_tradeItemData: tid,
  } = require("../XMLMessages/XML_Tags.json");
  const { item_desc, item_sku } = values;

  const item_ref = Math.random().toString(36).substring(2, 7);

  const xmlFilePath = path.join(cwd, "XMLMessages", "MDItem.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  xml[r][header][0][sender][0][id][0]._ = ""; //Mandatory: GLN (global location number) for the party who sent this item information
  xml[r][header][0][receiver][0][id][0]._ = ""; //Mandatory, but can be left empty
  xml[r][header][0][docId][0][instance][0] = ""; //Mandatory: Document identifier which uniquely identifies this message
  xml[r][header][0][docId][0][date][0] = new Date().toISOString(); //Mandatory: Time when this message was created
  xml[r][tid][0].tradeItemDescription[0]._ = item_desc; //Mandatory: English language description of item
  xml[r][tid][0].gtin = `${FTPI}:${PREFIX}.${item_ref}`; //urn:ibm:ift:product:class:2244002.00013
  xml[r][tid][0].sku = item_sku;
  // xml[r][tid][0].dataSource[0].gln = `${FTLI}:${PREFIX}.snnl`; //urn:ibm:ift:location:loc:2244002.snnl
  // xml[r][tid][0].dataRecipient[0].gln = `${FTLI}:${PREFIX}.snnl`; //urn:ibm:ift:location:loc:2244002.snnl

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

  log(xml[r]);

  return outputXml;
};

const mdFacility = async (values) => {
  const { party_root: r } = require("../XMLMessages/XML_Tags.json");
  const { facility_name, facility_role, facility_owner } = values;
  const xmlFilePath = path.join(cwd, "XMLMessages", "MDFacility.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  const loc_ref = Math.random().toString(36).substring(2, 7);

  xml[r][header][0][sender][0][id][0]._ = ""; //Mandatory: GLN (global location number) for the party who sent this item information
  xml[r][header][0][receiver][0][id][0]._ = ""; //Mandatory, but can be left empty
  xml[r][header][0][docId][0][instance][0] = ""; //Mandatory: Document identifier which uniquely identifies this message
  xml[r][header][0][docId][0][date][0] = new Date().toISOString();
  xml[r].party[0].isPartyActive[0] = true;
  xml[r].party[0].registeringParty[0] = `${FTLI}:${PREFIX}.growth`;
  xml[r].party[0].gln[0] = `${FTLI}:${PREFIX}.${loc_ref}`;
  xml[r].party[0].partyAddress[0].city[0] = "";
  xml[r].party[0].partyAddress[0].countryCode[0] = "Argentina";
  xml[r].party[0].partyAddress[0].name[0] = facility_name;
  xml[r].party[0].partyAddress[0].postalCode[0] = "";
  xml[r].party[0].partyRole[0].partyName[0] = facility_owner;
  xml[r].party[0].partyRole[0].partyRoleCode[0] = facility_role;

  log(JSON.stringify(xml[r]));
  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

  return outputXml;
};

const epcisCommission = async (values) => {
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

  const { item_ref, item_lot, item_qty } = values;
  const { biz_loc, src_loc, dest_loc } = values;
  const { date_exp, date_sellby, date_best } = values;

  const xmlFilePath = path.join(
    cwd,
    "server/XMLMessages",
    "EPCIS_Commission.xml"
  );
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  const epcClass = `${LFTPI}:${PREFIX}.${item_ref}.${item_lot}`;
  const location = `${FTLI}:${PREFIX}.${biz_loc}`;

  log("item_ref: " + item_ref);
  log("item_lot: " + item_lot);
  log("epcClass: " + epcClass);
  log(`location: ${FTLI}:${PREFIX}.${biz_loc}`);

  xml[r][b][0][el][0][oe][0].eventTime[0] = new Date().toISOString();
  xml[r][b][0][el][0][oe][0].baseExtension[0].eventID = `${UUID}:${uuidv1()}`;
  xml[r][b][0][el][0][oe][0].bizLocation[0].id = location;
  xml[r][b][0][el][0][oe][0][e][0][ql][0][qe][0].epcClass = epcClass;
  xml[r][b][0][el][0][oe][0][e][0][ql][0][qe][0].quantity = item_qty;
  xml[r][b][0][el][0][oe][0][e][0].sourceList[0]._ = src_loc;
  xml[r][b][0][el][0][oe][0][e][0][dl][0]._ = dest_loc;
  xml[r][b][0][el][0][oe][0][e][0].ilmd[0][exp] = date_exp;
  xml[r][b][0][el][0][oe][0][e][0].ilmd[0][sellBy] = date_sellby;
  xml[r][b][0][el][0][oe][0][e][0].ilmd[0][best] = date_best;
  xml[r][b][0][el][0][oe][0][e][0].ilmd[0][fl][0][f][0][fid][0] = location;
  xml[r][b][0][el][0][oe][0][e][0].ilmd[0][lot][0] = item_lot;

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

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

  const { item_ref_in, item_lot_in, item_ref_out, item_lot_out } = values;
  const { item_qty_in, item_qty_out } = values;
  const { biz_loc } = values;
  const { date_exp, date_sellby, date_best } = values;

  const xmlFilePath = path.join(cwd, "XMLMessages", "EPCIS_Transformation.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  // const bizLocation = `${FTLI}:${biz_loc}`;
  const item_epc_in = `${LFTPI}:${item_ref_in.split(":").pop()}.${item_lot_in}`;
  const item_epc_out = `${LFTPI}:${item_ref_out
    .split(":")
    .pop()}.${item_lot_out}`;

  xml[r][b][0][el][0][e][0][te][0].eventTime[0] = new Date().toISOString();
  xml[r][b][0][el][0][e][0][te][0][be][0].eventID = `${UUID}:${uuidv1()}`;
  xml[r][b][0][el][0][e][0][te][0][iql][0][qe][0].epcClass = item_epc_in;
  xml[r][b][0][el][0][e][0][te][0][iql][0][qe][0].quantity = item_qty_in;
  // xml[r][b][0][el][0][e][0][te][0][iql][0][qe][0].uom = `kg`;

  xml[r][b][0][el][0][e][0][te][0][oql][0][qe][0].epcClass = item_epc_out;
  xml[r][b][0][el][0][e][0][te][0][oql][0][qe][0].quantity = item_qty_out;
  // xml[r][b][0][el][0][e][0][te][0][oql][0][qe][0].uom = `kg`;

  xml[r][b][0][el][0][e][0][te][0].bizLocation[0].id = biz_loc;

  xml[r][b][0][el][0][e][0][te][0][e][0].ilmd[0][exp] = date_exp;
  xml[r][b][0][el][0][e][0][te][0][e][0].ilmd[0][sellBy] = date_sellby;
  xml[r][b][0][el][0][e][0][te][0][e][0].ilmd[0][best] = date_best;

  log(JSON.stringify(xml[r][b][0][el][0][e][0][te][0]));
  // log(JSON.stringify(xml[root].EPCISBody[0].EventList[0].extension[0].eventTime));

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

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

  const xmlFilePath = path.join(cwd, "XMLMessages", "EPCIS_Observation.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  // const bizLocation = `${FTLI}:${biz_loc}`;
  const item_epc = `${LFTPI}:${item_ref.split(":").pop()}.${item_lot}`;

  log(item_epc);

  xml[r][b][0][el][0][oe][0].eventTime[0] = new Date().toISOString();
  xml[r][b][0][el][0][oe][0].baseExtension[0].eventID = `${UUID}:${uuidv1()}`;
  xml[r][b][0][el][0][oe][0].disposition = `${DISP}:${item_disp}`;
  xml[r][b][0][el][0][oe][0].bizLocation[0].id = biz_loc;
  // xml[r][b][0][el][0][oe][0].epcList[0].epc = item_epc;
  xml[r][b][0][el][0][oe][0][e][0][ql][0][qe][0].epcClass = item_epc;
  xml[r][b][0][el][0][oe][0][e][0][ql][0][qe][0].quantity = item_qty;

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

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
  const { pallet, biz_loc } = values;

  const xmlFilePath = path.join(cwd, "XMLMessages", "EPCIS_Aggregation.xml");
  const xmlFile = await fs.readFile(xmlFilePath);
  const xml = await parseString(xmlFile);

  // const bizLocation = `${FTLI}:${biz_loc}`;
  const item_epc = `${LFTPI}:${item_ref.split(":").pop()}.${item_lot}`;
  // const item_epc = `${LFTPI}:${PREFIX}.${item_ref}.${item_lot}`;
  const pallet_serial = `${FTLPN}:${PREFIX}.${pallet}`;
  log(pallet_serial);

  xml[r][b][0][el][0][ea][0].eventTime[0] = new Date().toISOString();
  xml[r][b][0][el][0][ea][0].baseExtension[0].eventID = `${UUID}:${uuidv1()}`;
  xml[r][b][0][el][0][ea][0].parentID = pallet_serial;
  xml[r][b][0][el][0][ea][0].bizLocation[0].id = biz_loc;
  xml[r][b][0][el][0][ea][0][e][0][ql][0][qe][0].epcClass = item_epc;
  xml[r][b][0][el][0][ea][0][e][0][ql][0][qe][0].quantity = item_qty;

  const builder = new xml2js.Builder();
  const outputXml = builder.buildObject(xml);

  return outputXml;
};

exports.mdItem = mdItem;
exports.mdFacility = mdFacility;
exports.epcisCommission = epcisCommission;
exports.epcisTransformation = epcisTransformation;
exports.epcisObservation = epcisObservation;
exports.epcisAggregation = epcisAggregation;
