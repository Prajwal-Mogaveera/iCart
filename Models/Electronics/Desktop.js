const mongoose = require("mongoose")

const { Schema } = mongoose

const userSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    require: true
  },
  details: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  count: {
    type: Number,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: new Date()
  }
})

module.exports = mongoose.model("Desktop", userSchema)
