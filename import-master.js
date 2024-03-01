const { flatten, keys, trim } = require("lodash");
const { getDB } = require("./dbclient");
// console.log(data.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE[0].VOUCHER[0])
// let cnt = 0;

function getIfNotNull(from, key) {
  let value = from && from[key] ? from[key][0] : "";
  switch (key) {
    case "DATE":
    case "VCHSTATUSDATE":
    case "EFFECTIVEDATE":
      const dt = from[key][0];
      return from && dt
        ? new Date(
            `${dt[0]}${dt[1]}${dt[2]}${dt[3]}-${dt[4]}${dt[5]}-${dt[6]}${dt[7]}`
          )
        : "";
    case "AMOUNT":
    case "VATEXPAMOUNT":
      return from && from[key] ? from[key][0] : 0;
    default:
      return from && from[key]
        ? trim(from[key][0].replace(/(\r\n|\n|\r)/gm, "").replace(/,/gm, ";"))
        : "";
  }
}

async function importData(filename) {
  const data = require(filename);
  const collectionData = [];
  data.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.forEach(
    (tm) => {
      // tm.LEDGER && console.log(Object.keys(tm.LEDGER['0']));
      tm.LEDGER && console.log(`${tm.LEDGER["0"].$.NAME},${tm.LEDGER["0"].PARENT['0']}`);


    }
  );
  // const {db, client} = await getDB();
}
importData("./json/master.json");
