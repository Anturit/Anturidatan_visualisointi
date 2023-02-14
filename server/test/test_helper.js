const User = require('../models/user')
const Sender = require('../models/sender')


const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const sendersInDb = async () => {
  const senders = await Sender.find({})
  return senders.map((s) => s.toJSON())
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
  password: 'User@user1',
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
  password: 'Expireduser@user1',
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
  password: 'Admin@admin1',
})

const smallSender = () => ({
  seq_number: 226,
  device: 'E00208B4',
  sen_battery: 1.66,
  date: expiredDate,
  sen_id: '6a',
  measurement: 55
})

const bigSender = () => ({
  seq_number: 2,
  device: 'E00208B4',
  sen_battery: 2.78,
  date: expiredDate,
  sen_id: 'f3',
  dev_battery: 3.19,
  temperature: 21.04,
  humidity: 27.41,
  pressure: 101823
})


module.exports = {
  usersInDb,
  sendersInDb,
  userUser,
  adminUser,
  expiredUser,
  smallSender,
  bigSender,
}