const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}
const expiredDate = new Date('2000-04-20T06:12:14.241Z')
const nonExpiredDate = new Date('3000-04-20T06:12:14.241Z')
const userUser = () => ({
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
})

const expiredUser = () => ({
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
})

const adminUser = () => ({
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
})

module.exports = {
  usersInDb, userUser, adminUser, expiredUser
}