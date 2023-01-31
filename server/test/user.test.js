
const listHelper = require('../utils/users_helper')

test('empty users list returns zero', () => {
  const users = []
  const result = listHelper.dummy(users)
  expect(result).toBe(0)
})

/* test('users list with one users returns one', () => {
  const listWithOneUsers = [
    {
      _id: '5a422aa71b54a676234d17f8',
      username: 'username',
      name: 'name',
      role: 'user',
      passwordHash: '$2b$10$PYhmMaIF.UbM27UW.aXd1ODmDTM7v.ojlxK',
      sensordataObjectIds: ['6a','d7'],
      __v: 0
    }
  ]
  const result = listHelper.dummy(listWithOneUsers)
  expect(result).toBe(2)
}) 

test('users list with one users contains correct sensordata', () => {
  const listWithOneUsers = [
    {
      _id: '5a422aa71b54a676234d17f8',
      username: 'username',
      name: 'name',
      role: 'user',
      passwordHash: '$2b$10$PYhmMaIF.UbM27UW.aXd1ODmDTM7v.ojlxK',
      sensordataObjectIds: ['6a','d7'],
      __v: 0
    }
  ]
  const result = listHelper.userSensors(listWithOneUsers[0])
  expect(result).toStrictEqual(['6a', 'd7'])
})  */