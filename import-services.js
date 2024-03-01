const { getDB } = require("./dbclient");
const lodash = require("lodash");
const departmentDictionary = {
  STAAH: "STAAH",
  digital: "Digital Media",
  website: "Website Development",
  domain: "Domain And Hosting",
  maintenance: "Maintenance Of Website",
  branding: "Branding",
};
const services = {
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
  "Social Media Optimisation": departmentDictionary.digital,
  "Social Media Marketing": departmentDictionary.digital,
  "Google Ads Commission": departmentDictionary.digital,
  "Google Adwords for the Website": departmentDictionary.digital,
  "Social Media": departmentDictionary.digital,
  "Google Adwords  Management": departmentDictionary.digital,
  "Google Adwords Commission": departmentDictionary.digital,
  "Influencer Marketing": departmentDictionary.digital,
  SEO: departmentDictionary.digital,
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
};

async function importData() {
  const { db, client } = await getDB();
  const departmentCollection = await db.collection("departments").find({});
  const departmentArray = await departmentCollection.toArray();
  const newServices = [];
  for (service in services) {
    const department = lodash.find(departmentArray, {
      NAME: services[service],
    });
    newServices.push({
      DEPARTMENT: department._id,
      SERVICE: service,
    });
  }
  const insertServices = await db.collection("services").insertMany(newServices);
  console.log(insertServices);
  client.close();
}

importData();
