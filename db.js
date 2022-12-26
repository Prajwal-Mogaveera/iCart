const mongoose = require("mongoose")

const url = "mongodb://localhost:27017/iCart"

const connectToMongo = () => {
  mongoose.connect(url, () => {
    console.log("Connected to mongo")
  })
}

module.exports = connectToMongo
