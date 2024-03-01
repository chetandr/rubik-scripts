
const {flatten, keys} = require("lodash");
const {getDB} = require("./dbclient");
// console.log(data.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE[0].VOUCHER[0])
// let cnt = 0;
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
function getIfNotNull(from, key) {
  let value = from && from[key] ? from[key][0] : "";
  switch(key) {
    case "DATE":
    case "VCHSTATUSDATE":
    case "EFFECTIVEDATE":
      const dt = from[key][0];
      return from && dt ? new Date(`${dt[0]}${dt[1]}${dt[2]}${dt[3]}-${dt[4]}${dt[5]}-${dt[6]}${dt[7]}`) : ""
    case "AMOUNT":
    case "VATEXPAMOUNT":
      return from && from[key] ? from[key][0] : 0
    default:
        if(from[key][0].indexOf("\r\n")) {
          console.log(from[key], from[key][0].indexOf("\r\n"))
        }
        return from && from[key] ? from[key][0].replace(/(\r\n|\n|\r)/gm, "")  : ""

  }
  return from && from[key] ? from[key][0] : "";

} 

async function exportData() {
  const {db, client} = await getDB();
  const dt = db.collection("vouchers").find({VCHTYPE:{$in: ["Purchase","Hdfc Payment","ICICI Payment","Cash (Hdfc)","Payment","PNB Payment","Hdfc C C Payment"]}}).sort("DATE","asc");
  let header =  "VCHTYPE";
  header += ",DATE";
  header += ",PARTYLEDGERNAME";
  header + ", INVOICE NUMBER";
  header += ",LEDGERNAME/STOCKITEM";
  header += ",AMOUNT";
  header += ",DEPARTMENT";
  // console.log(header);
  const ledgers = {};
  (await dt.toArray()).forEach(vc=> {
    vc.LEDGERENTRIES.forEach(ld => {
      ledgers[ld.LEDGERNAME] = 1;
    })
  })
  client.close();
  Object.keys(ledgers).forEach(k=>console.log(k))
}

exportData();