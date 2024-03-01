const { flatten, keys } = require("lodash");
const { getDB } = require("./dbclient");
// console.log(data.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE[0].VOUCHER[0])
// let cnt = 0;
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const exportMonth = process.argv[2];
const exportYear = process.argv[3];
const lastDay = {
  "01": 31,
  "02": !(exportYear % 4) ? 28 : 29,
  "03": 31,
  "04": 30,
  "05": 31,
  "06": 30,
  "07": 31,
  "08": 31,
  "09": 30,
  "10": 31,
  "11": 30,
  "12": 31,
};
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
      if (from[key][0].indexOf("\r\n")) {
        console.log(from[key], from[key][0].indexOf("\r\n"));
      }
      return from && from[key]
        ? from[key][0].replace(/(\r\n|\n|\r)/gm, "")
        : "";
  }
  return from && from[key] ? from[key][0] : "";
}

async function exportData() {
  const { db, client } = await getDB();
  const dt = db
    .collection("vouchers")
    .find({
      $and: [
        { VCHTYPE: { $in: ["Sales", "Credit Note"] } },
        { DATE: { $gte: new Date(`${exportYear}-${exportMonth}-01`) } },
        { DATE: { $lte: new Date(`${exportYear}-${exportMonth}-${lastDay[exportMonth]}`) } },
      ],
    })
    .sort("DATE", "asc");
  let header = "VCHTYPE";
  header += ",DATE";
  header += ",PARTYLEDGERNAME";
  header += ", INVOICE NUMBER";
  header += ",LEDGERNAME/STOCKITEM";
  header += ",AMOUNT";
  header += ",DEPARTMENT";
  console.log(header);
  (await dt.toArray()).forEach((vc) => {
    vc.LEDGERENTRIES.forEach((ld) => {
      let row = `${vc.VCHTYPE}`;
      row += `,${months[new Date(vc.DATE).getMonth()]}-${new Date(
        vc.DATE
      ).getFullYear()}`;
      row += `,${vc.PARTYLEDGERNAME}`;
      row += `,${vc.VOUCHERNUMBER}`;
      row += `,${ld.LEDGERNAME}`;
      row += `,${ld.AMOUNT}`;
      row += `,${ld.DEPARTMENT}`;
      if (
        ld.LEDGERNAME !== vc.PARTYLEDGERNAME &&
        ld.LEDGERNAME.indexOf("GST") < 0
      )
        console.log(row);
    });
    if (vc.INVENTORIES) {
      vc.INVENTORIES.forEach((iv) => {
        let row = `${vc.VCHTYPE}`;
        row += `,${months[new Date(vc.DATE).getMonth()]}-${new Date(
          vc.DATE
        ).getFullYear()}`;
        row += `,${vc.PARTYLEDGERNAME}`;
        row += `,${vc.VOUCHERNUMBER}`;
        row += `,${iv.STOCKITEMNAME}`;
        row += `,${iv.AMOUNT}`;
        row += `,${iv.DEPARTMENT}`;
        console.log(row);
      });
    }
  });
  client.close();
}

exportData();
