const { MongoClient } = require("mongodb");

 async function getDB() {
  //
  const mongoURL = "mongodb://localhost:27017";
  const mongoClient = new MongoClient(mongoURL);
  const clientPromise = mongoClient.connect();
  const client = await clientPromise;
  return { db: client.db("crm"), client };
}

module.exports = {getDB}