const User = require('../models/user')
const Sender = require('../models/sender')


const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const userInDb = async (id) => {
  const user = await User.findById(id)
  return user.toJSON()
}

const sendersInDb = async () => {
  const senders = await Sender.find({})
  return senders.map((s) => s.toJSON())
}

const expiredDate = new Date('2000-04-20T06:12:14.241Z')
const nonExpiredDate = new Date('3000-04-20T06:12:14.241Z')
const userUser = () => ({
  username: 'user@user.com',
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
  username: 'expireduser@user.com',
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
  username: 'admin@admin.com',
  firstName: 'AdminTest',
  lastName: 'AdminTest',
  address: 'AdminStreet',
  postalCode: '00100',
  city: 'Helsinki',
  role: 'admin',
  expirationDate: nonExpiredDate,
  senderDeviceIds: [],
  password: 'Admin@admin1',
})

const oneDeviceUser = () => ({
  username: 'Onedeviceuser1@Onedeviceuser1.com',
  password: 'Onedeviceuser1@Onedeviceuser1',
  firstName: 'Onedeviceuser',
  lastName: 'Onedeviceuser',
  address: 'Onedevicestreet 1',
  postalCode: '00000',
  city: 'Onedevicecity',
  role: 'user',
  expirationDate: nonExpiredDate,
  senderDeviceIds: [
    'E00208B4'
  ]
})

const twoDeviceUser = () => ({
  username: 'Twodeviceuser1@Twodeviceuser1.com',
  password: 'Twodeviceuser1@Twodeviceuser1',
  firstName: 'Twodeviceuser',
  lastName: 'Twodeviceuser',
  address: 'Twodevicestreet 1',
  postalCode: '00000',
  city: 'Twodevicecity',
  role: 'user',
  expirationDate: nonExpiredDate,
  senderDeviceIds: [
    'E00208B4', '1B2AF5B'
  ]
})

const smallSender = () => ({
  seq_number: 226,
  device: '1B2AF5B',
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
  userInDb,
  usersInDb,
  sendersInDb,
  userUser,
  adminUser,
  expiredUser,
  oneDeviceUser,
  twoDeviceUser,
  smallSender,
  bigSender,
}