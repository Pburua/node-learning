const mongodb = require("mongodb");

const { MONGO_URL } = require("../env");

const MongoClient = mongodb.MongoClient;

let _db;

const connectToMongo = (callback) => {
  client = new MongoClient(MONGO_URL);
  client
    .connect()
    .then(() => {
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.err(err);
    });
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!'
}

module.exports = { connectToMongo, getDb };
