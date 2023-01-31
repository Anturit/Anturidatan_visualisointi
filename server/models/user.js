const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstname: String,
  lastname: String,
  address: String,
  postalcode: String,
  city: String,
  role: {
    type: String,
    enum: {
      values:['admin','user'],
      message: 'role must be admin or user'
    }
  },
  expirationdate: Date,
  passwordHash: String,
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
