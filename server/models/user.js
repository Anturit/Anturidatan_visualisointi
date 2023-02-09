const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: 'role must be admin or user'
    }
  },
  expirationDate: {
    type: Date,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  senderDeviceIds: [
    {
      type: String,
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
