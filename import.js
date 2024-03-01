const { flatten, keys, trim, camelCase } = require("lodash");
const { getDB } = require("./dbclient");
// console.log(data.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE[0].VOUCHER[0])
// let cnt = 0;
const departmentDictionary = {
  STAAH :"STAAH",
  digital : "Digital Media",
  website: "Website Development",
  domain: "Domain And Hosting",
  maintenance: "Maintenance Of Website",
  branding: "Branding"
}
const Departments = {
  "Monthly Fees C M": departmentDictionary.STAAH,
  "Booking Engine & C.M.S. (STAAH)": departmentDictionary.STAAH,
  "Monthly Fees  B E": departmentDictionary.STAAH,
  "Monthly Google Listing": departmentDictionary.STAAH,
  "Monthly CM (1)": departmentDictionary.STAAH,
  "Set Up C M": departmentDictionary.STAAH,
  "Monthly Fees RM": departmentDictionary.STAAH,
  "Setup Payment Gateway": departmentDictionary.STAAH,
  "Monthly BE (1)": departmentDictionary.STAAH,
  "Set Up B E": departmentDictionary.STAAH,
  "Monthly Google Listing  (1)": departmentDictionary.STAAH,
  "Setup PMS": departmentDictionary.STAAH,
  "Monthly Fee Travel Agent Module": departmentDictionary.STAAH,
  "Setup CM(1)": departmentDictionary.STAAH,
  "Monthly Opera Fee": departmentDictionary.STAAH,
  "Setup BE(1)": departmentDictionary.STAAH,
  "Monthly Fees RM (1)": departmentDictionary.STAAH,
  "Monthly Fees Instant Website": departmentDictionary.STAAH,
  "Monthly Gift Voucher Engine": departmentDictionary.STAAH,
  "Setup Gift Voucher Engine": departmentDictionary.STAAH,
  "Setup Google Listing": departmentDictionary.STAAH,
  "Setup Instant Site": departmentDictionary.STAAH,
  "Setup PMS (1)": departmentDictionary.STAAH,
  "Setup Google Listing (1)": departmentDictionary.STAAH,
  "Search Engine Optimisation": departmentDictionary.digital,
  "Social Media Optimisation":departmentDictionary.digital,
  "Social Media Marketing": departmentDictionary.digital,
  "Google Ads Commission": departmentDictionary.digital,
  "Google Adwords for the Website": departmentDictionary.digital,
  "Social Media": departmentDictionary.digital,
  "Google Adwords  Management": departmentDictionary.digital,
  "Google Adwords Commission": departmentDictionary.digital,
  "Influencer Marketing": departmentDictionary.digital,
  "SEO": departmentDictionary.digital,
  "Social Media Campaign": departmentDictionary.digital,
  "Social Media Management": departmentDictionary.digital,
  "Google  Agency Fees": departmentDictionary.digital,
  "Landing Page": departmentDictionary.digital,
  "You Tube Content Management Fees": departmentDictionary.digital,
  "You Tube Agency Fess": departmentDictionary.digital,
  "Facebook Ads Commissions": departmentDictionary.digital,
  "Paid Ads": departmentDictionary.digital,
  "Social Media Optimisations": departmentDictionary.digital,
  "Facebook/instagram Ads Commissions": departmentDictionary.digital,
  "Face Book Ads Comission": departmentDictionary.digital,
  "Facebook/ Instagram Ads Commission": departmentDictionary.digital,
  "Google Ads Campaign": departmentDictionary.digital,
  "Googlr Ads Campaign": departmentDictionary.digital,
  "Facebook Ad Cost": departmentDictionary.digital,
  "Auto Malware Removal": departmentDictionary.digital,
  "Renewal of Hosting": departmentDictionary.domain,
  "Renewal of Domain Name": departmentDictionary.domain,
  "Renewal of": departmentDictionary.domain,
  "Registration of": departmentDictionary.domain,
  "Renewal of Email Ids": departmentDictionary.domain,
  "Renewal of Domain Names": departmentDictionary.domain,
  "Hosting Charges": departmentDictionary.domain,
  "Renewal of Hostings": departmentDictionary.domain,
  "Website Secure Hosting": departmentDictionary.domain,
  "Renewal of Cpanel License": departmentDictionary.domain,
  "Renewal of Domain Name & Hosting Charges": departmentDictionary.domain,
  "Support Charges (Optional)": departmentDictionary.domain,
  "Registration and Renewal of Hostings": departmentDictionary.domain,
  "Renewal of Email Hosting": departmentDictionary.domain,
  "PHP Upgradation": departmentDictionary.domain,
  "Website Migration": departmentDictionary.domain,
  "Registration of Domain Name": departmentDictionary.domain,
  "Website Activation Charges": departmentDictionary.domain,
  "Registration of Domain Names": departmentDictionary.domain,
  "Upgradation of Hosting": departmentDictionary.domain,
  "Renewal of C Panel Licenses": departmentDictionary.domain,
  "Transfer and Renewal of Domain": departmentDictionary.domain,
  "Annual Maintenance": departmentDictionary.maintenance,
  "Updates and Changes": departmentDictionary.maintenance,
  "Annual Maintenances": departmentDictionary.maintenance,
  "Maintenance of Web Site": departmentDictionary.maintenance,
  "Updates & Maintenance": departmentDictionary.maintenance,
  "Website Changes": departmentDictionary.maintenance,
  "Website Update Services": departmentDictionary.maintenance,
  "Website Development": departmentDictionary.website,
  "Website Developments": departmentDictionary.website,
  "Content Writing": departmentDictionary.website,
  "Content Writings": departmentDictionary.website,
  "Website Content Writing": departmentDictionary.website,
  "Designing of Brochure": departmentDictionary.branding,
  "Designing of Hoarding": departmentDictionary.branding,
  "Rounded Off": "",
  Discount: "",
  "Advance Received": "",
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
      return from && from[key]
        ? trim(from[key][0].replace(/(\r\n|\n|\r)/gm, "").replace(/,/gm, ";"))
        : "";
  }
}

function getDepartment(service) {
  let department = Departments[trim(service)];
  return department ? department : null;
}

async function importData(filename) {
  const data = require(filename);
  const collectionData = [];
  const { db, client } = await getDB();
  data.ENVELOPE.BODY[0].IMPORTDATA[0].REQUESTDATA[0].TALLYMESSAGE.forEach(
    async (tm) => {
      if (tm.VOUCHER) {
        const dt = {
          VCHTYPE: tm.VOUCHER[0].$.VCHTYPE,
          DATE: getIfNotNull(tm.VOUCHER[0], "DATE"),
          VCHSTATUSDATE: getIfNotNull(tm.VOUCHER[0], "VCHSTATUSDATE"),
          NARRATION: getIfNotNull(tm.VOUCHER[0], "NARRATION"),
          ENTEREDBY: getIfNotNull(tm.VOUCHER[0], "ENTEREDBY"),
          CMPGSTIN: getIfNotNull(tm.VOUCHER[0], "CMPGSTIN"),
          VOUCHERTYPENAME: getIfNotNull(tm.VOUCHER[0], "VOUCHERTYPENAME"),
          PARTYLEDGERNAME: getIfNotNull(tm.VOUCHER[0], "PARTYLEDGERNAME"),
          VOUCHERNUMBER: getIfNotNull(tm.VOUCHER[0], "VOUCHERNUMBER"),
          CMPGSTREGISTRATIONTYPE: getIfNotNull(
            tm.VOUCHER[0],
            "CMPGSTREGISTRATIONTYPE"
          ),
          CMPGSTSTATE: getIfNotNull(tm.VOUCHER[0], "CMPGSTSTATE"),
          NUMBERINGSTYLE: getIfNotNull(tm.VOUCHER[0], "NUMBERINGSTYLE"),
          VCHSTATUSVOUCHERTYPE: getIfNotNull(
            tm.VOUCHER[0],
            "VCHSTATUSVOUCHERTYPE"
          ),
          VCHSTATUSTAXUNIT: getIfNotNull(tm.VOUCHER[0], "VCHSTATUSTAXUNIT"),
          VCHENTRYMODE: getIfNotNull(tm.VOUCHER[0], "VCHENTRYMODE"),
          EFFECTIVEDATE: getIfNotNull(tm.VOUCHER[0], "EFFECTIVEDATE"),
          ALTERID: getIfNotNull(tm.VOUCHER[0], "ALTERID"),
          MASTERID: getIfNotNull(tm.VOUCHER[0], "MASTERID"),
          VOUCHERKEY: getIfNotNull(tm.VOUCHER[0], "VOUCHERKEY"),
          VOUCHERRETAINKEY: getIfNotNull(tm.VOUCHER[0], "VOUCHERRETAINKEY"),
        };

        if (tm.VOUCHER[0]["ALLLEDGERENTRIES.LIST"]) {
          const ledgerEntries = [];
          tm.VOUCHER[0]["ALLLEDGERENTRIES.LIST"].forEach((ale) => {
            const ledgerEntry = {
              LEDGERNAME: ale ? getIfNotNull(ale, "LEDGERNAME") : "",
              GSTCLASS: ale ? getIfNotNull(ale, "GSTCLASS") : "",
              AMOUNT: parseFloat(ale ? getIfNotNull(ale, "AMOUNT") : "0"),
              VATEXPAMOUNT: parseFloat(
                ale ? getIfNotNull(ale, "VATEXPAMOUNT") : "0"
              ),
              DEPARTMENT: ale
                ? getDepartment(getIfNotNull(ale, "LEDGERNAME"))
                : "STAAH",
            };
            ledgerEntries.push(ledgerEntry);
          });
          dt["LEDGERENTRIES"] = ledgerEntries;
        }

        if (tm.VOUCHER[0]["LEDGERENTRIES.LIST"]) {
          const ledgerEntries = [];
          tm.VOUCHER[0]["LEDGERENTRIES.LIST"].forEach((ale) => {
            const ledgerEntry = {
              LEDGERNAME: ale ? getIfNotNull(ale, "LEDGERNAME") : "",
              GSTCLASS: ale ? getIfNotNull(ale, "GSTCLASS") : "",
              AMOUNT: parseFloat(ale ? getIfNotNull(ale, "AMOUNT") : "0"),
              VATEXPAMOUNT: parseFloat(
                ale ? getIfNotNull(ale, "VATEXPAMOUNT") : "0"
              ),
              DEPARTMENT: ale
                ? getDepartment(getIfNotNull(ale, "LEDGERNAME"))
                : "STAAH",
            };
            ledgerEntries.push(ledgerEntry);
          });
          dt["LEDGERENTRIES"] = ledgerEntries;
        }
        if (
          tm.VOUCHER[0]["ALLINVENTORYENTRIES.LIST"] &&
          trim(tm.VOUCHER[0]["ALLINVENTORYENTRIES.LIST"][0]) !== ""
        ) {
          const ledgerEntries = [];
          tm.VOUCHER[0]["ALLINVENTORYENTRIES.LIST"].forEach((ale) => {
            const ledgerEntry = {
              STOCKITEMNAME: ale ? getIfNotNull(ale, "STOCKITEMNAME") : "",
              GSTOVRDNISREVCHARGEAPPL: ale
                ? getIfNotNull(ale, "GSTOVRDNISREVCHARGEAPPL")
                : "",
              AMOUNT: parseFloat(ale ? getIfNotNull(ale, "AMOUNT") : "0"),
              DEPARTMENT: ale
                ? getDepartment(getIfNotNull(ale, "STOCKITEMNAME"))
                : "",
            };
            ledgerEntries.push(ledgerEntry);
          });
          dt["INVENTORIES"] = ledgerEntries;
        }
        // console.log(dt);
        collectionData.push(dt);
      }

      // client.connect();
      //   const newRecord = await db.collection("vouchers").insertMany(collectionData, { ordered : false });
      //   client.close();
      //   console.log(newRecord);
      //  element.VOUCHER && console.log(element.VOUCHER);
      //  element.COMPANY && console.log(element.COMPANY);
    }
  );
  client.connect();
  const newRecord = await db
    .collection("vouchers")
    .insertMany(collectionData, { ordered: false });
  client.close();
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
];

files.forEach((f) => importData(f));
