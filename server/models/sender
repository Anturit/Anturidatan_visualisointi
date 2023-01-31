const mongoose = require('mongoose')

const senderSchema = mongoose.Schema({

  seq_number: {
    type: Number,
    required: true
  },
  device: {
    type: String,
    required: true
  },
  sen_battery: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  sen_id: {
    type: String,
    required: true
  },
  measurement: Number,
  dev_battery: Number,
  temperature: Number,
  humidity : Number,
  pressure : Number

})


senderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Sender = mongoose.model('Sender', senderSchema)
module.exports = Sender