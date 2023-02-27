const router = require('express').Router()
const User = require('../models/user')
const Sender = require('../models/sender')
const helper = require('../test/test_helper')
const bcrypt = require('bcrypt')

// Test environment purpoeses only, resets db to a base state for testing
router.post('/reset', async (request, response) => {
  await User.deleteMany({})
  const testUsers = [helper.userUser(), helper.expiredUser(), helper.adminUser(), helper.oneDeviceUser(), helper.twoDeviceUser()]
  const saltRounds = 10

  let savedUsers = []

  for (let user of testUsers) {
    const passwordHash = await bcrypt.hash(user.password, saltRounds)
    user.passwordHash = passwordHash
    delete user.password
    const mongoUser = new User(user)
    const savedUser = await mongoUser.save()
    savedUsers = savedUsers.concat(savedUser)
  }
  await Sender.deleteMany({})
  const mongoSender = new Sender(helper.smallSender())
  await mongoSender.save()
  const mongoSender2 = new Sender(helper.bigSender())
  await mongoSender2.save()
  response.status(201).json(savedUsers)
})

module.exports = router
