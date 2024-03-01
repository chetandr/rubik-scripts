
const {flatten, keys, trim} = require("lodash");
const {getDB} = require("./dbclient");
// console.log(data.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE[0].VOUCHER[0])
// let cnt = 0;

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
        return from && from[key] ? trim(from[key][0].replace(/(\r\n|\n|\r)/gm, "").replace(/,/gm, ";")) : ""

  }
} 

async function importData(filename) {
  const data = require(filename);
  const collectionData = [];
  const {db, client} = await getDB();
  data.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.forEach(async (tm) => {
    if(tm.VOUCHER) {
        const dt = {VCHTYPE: tm.VOUCHER[0].$.VCHTYPE,
          "DATE": getIfNotNull(tm.VOUCHER[0],"DATE"),
          "VCHSTATUSDATE": getIfNotNull(tm.VOUCHER[0],"VCHSTATUSDATE"),
          "NARRATION": getIfNotNull(tm.VOUCHER[0],"NARRATION"),
          "ENTEREDBY": getIfNotNull(tm.VOUCHER[0],"ENTEREDBY"),
          "CMPGSTIN": getIfNotNull(tm.VOUCHER[0],"CMPGSTIN"),
          "VOUCHERTYPENAME": getIfNotNull(tm.VOUCHER[0],"VOUCHERTYPENAME"),
          "PARTYLEDGERNAME": getIfNotNull(tm.VOUCHER[0],"PARTYLEDGERNAME"),
          "VOUCHERNUMBER": getIfNotNull(tm.VOUCHER[0],"VOUCHERNUMBER"),
          "CMPGSTREGISTRATIONTYPE": getIfNotNull(tm.VOUCHER[0],"CMPGSTREGISTRATIONTYPE"),
          "CMPGSTSTATE": getIfNotNull(tm.VOUCHER[0],"CMPGSTSTATE"),
          "NUMBERINGSTYLE": getIfNotNull(tm.VOUCHER[0],"NUMBERINGSTYLE"),
          "VCHSTATUSVOUCHERTYPE": getIfNotNull(tm.VOUCHER[0],"VCHSTATUSVOUCHERTYPE"),
          "VCHSTATUSTAXUNIT": getIfNotNull(tm.VOUCHER[0],"VCHSTATUSTAXUNIT"),
          "VCHENTRYMODE": getIfNotNull(tm.VOUCHER[0],"VCHENTRYMODE"),
          "EFFECTIVEDATE": getIfNotNull(tm.VOUCHER[0],"EFFECTIVEDATE"),
          "ALTERID": getIfNotNull(tm.VOUCHER[0],"ALTERID"),
          "MASTERID": getIfNotNull(tm.VOUCHER[0],"MASTERID"),
          "VOUCHERKEY": getIfNotNull(tm.VOUCHER[0],"VOUCHERKEY"),
          "VOUCHERRETAINKEY": getIfNotNull(tm.VOUCHER[0],"VOUCHERRETAINKEY"),
        }
        const ledgerEntries = [];
        if(tm.VOUCHER[0]["ALLLEDGERENTRIES.LIST"]) {
          console.log("calculating")
          tm.VOUCHER[0]["ALLLEDGERENTRIES.LIST"].forEach(ale => {
            const ledgerEntry =  {
              "LEDGERNAME": ale ? getIfNotNull(ale,"LEDGERNAME") : "",
              "GSTCLASS":  ale ? getIfNotNull(ale,"GSTCLASS") : "",
              "AMOUNT":  parseFloat(ale ? getIfNotNull(ale,"AMOUNT") : "0"),
              "VATEXPAMOUNT":  parseFloat(ale ? getIfNotNull(ale,"VATEXPAMOUNT") : "0")
            }
            ledgerEntries.push(ledgerEntry);
          })
          dt["LEDGERENTRIES"] = ledgerEntries
        }
        if(tm.VOUCHER[0]["LEDGERENTRIES.LIST"]) {
          console.log("calculating")
          tm.VOUCHER[0]["LEDGERENTRIES.LIST"].forEach(ale => {
            const ledgerEntry =  {
              "LEDGERNAME": ale ? getIfNotNull(ale,"LEDGERNAME") : "",
              "GSTCLASS":  ale ? getIfNotNull(ale,"GSTCLASS") : "",
              "AMOUNT":  parseFloat(ale ? getIfNotNull(ale,"AMOUNT") : "0"),
              "VATEXPAMOUNT":  parseFloat(ale ? getIfNotNull(ale,"VATEXPAMOUNT") : "0")
            }
            ledgerEntries.push(ledgerEntry);
          })
          dt["LEDGERENTRIES"] = ledgerEntries
        }
        
        // console.log(dt);
        collectionData.push(dt);
        
      }
      client.connect();
        const newRecord = await db.collection("vouchers").insertMany(collectionData, { ordered : false });
        client.close();
      //   console.log(newRecord);
      //  element.VOUCHER && console.log(element.VOUCHER);
      //  element.COMPANY && console.log(element.COMPANY);
  });
}
const files = [
  "./json/AprilTransactions.json",
  "./json/MayTransactions.json",
  "./json/JuneTransactions.json",
  "./json/JulyTransactions.json",
  "./json/AugTransactions.json",
  "./json/SeptTransactions.json",
  "./json/OctTransactions.json",
  "./json/NovTransactions.json",
  "./json/DecTransactions.json",
  "./json/Jan2024Transactions.json",
]

files.forEach(f=>importData(f));
