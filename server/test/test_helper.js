const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const newUser = {
  username: 'someuser',
  name: 'Some User',
  role: 'user',
  password: 'somepasswordhash',
  sensordataObjectIds: ['sensor1','sensor2']

}

module.exports = {
  usersInDb,
  newUser,
}