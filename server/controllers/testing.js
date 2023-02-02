const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const usersRouter = require('./users')

const expiredDate = new Date('2000-04-20T06:12:14.241Z')
const nonExpiredDate = new Date('3000-04-20T06:12:14.241Z')
const userUser = {
  username: 'user@user',
  firstName: 'UserTest',
  lastName: 'UserTest',
  address: 'UserStreet',
  postalCode: '00100',
  city: 'Helsinki',
  role: 'user',
  expirationDate: nonExpiredDate,
  senderDeviceIds: ['E00208B4'],
  password: 'user@user',
}

const expiredUser = {
  username: 'expireduser@user',
  firstName: 'ExpiredUserTest',
  lastName: 'ExpiredUserTest',
  address: 'UserStreet',
  postalCode: '00100',
  city: 'Helsinki',
  role: 'user',
  expirationDate: expiredDate,
  senderDeviceIds: ['E00208B4'],
  password: 'expireduser@user',
}

const adminUser = {
  username: 'admin@admin',
  firstName: 'AdminTest',
  lastName: 'AdminTest',
  address: 'AdminStreet',
  postalCode: '00100',
  city: 'Helsinki',
  role: 'admin',
  expirationDate: nonExpiredDate,
  senderDeviceIds: ['E00208B4'],
  password: 'admin@admin',
}


router.post('/reset', async (request, response) => {
  await User.deleteMany({})
  const testUsers = [userUser, expiredUser, adminUser]
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
  response.status(201).json(savedUsers)
})

module.exports = router
