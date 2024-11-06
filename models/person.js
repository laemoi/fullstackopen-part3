const mongoose = require("mongoose")
mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model("Person", personSchema)