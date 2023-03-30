const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

let ADMINTOKEN = ''
let USERTOKEN = ''
const WRONGTOKEN = 'this_is_a_wrong_token'

let ADMINID = ''
let USERID = ''

/**
 * Logins helper type of user
 * @param {*} user object from test_helper.js
 * @returns {string} token - for authentication
 */
const loginUser = async (user) => {
  const response = await supertest(app)
    .post('/api/login')
    .send({
      username: user.username,
      password: user.password,
    })
  return response.body.token
}

/**
 * Resets database and fetches authentication tokens
 */
const initialize = async () => {

  const savedUsers = await supertest(app)
    .post('/api/testing/reset')
    .expect(201)

  USERTOKEN = await loginUser(helper.userUser())
  ADMINTOKEN = await loginUser(helper.adminUser())

  USERID = savedUsers.body[0].id
  ADMINID = savedUsers.body[2].id
}

beforeAll(async () => {
  await initialize()
})

describe('When there is initially one admin - user and two user - users at db : users get', () => {
  test('get all users fails if not login', async () => {
    const response = await api
      .get('/api/users')
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('invalid token')
  })
  test('get all users fails if USER login', async () => {
    const response = await api
      .get('/api/users')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('you don´t have rights for this operation')
  })

  test('get all users succees if ADMIN  login', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api
      .get('/api/users')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(usersAtStart.length)
  })
})

describe('When there is initially one admin - user and two user - users at db : users get by id', () => {
  test('get user by id fails if not logged', async () => {
    const response = await api
      .get(`/api/users/${ADMINID}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('invalid token')
  })

  test('get user by id fails if id is not valid', async () => {
    const response = await api
      .get(`/api/users/${ADMINID}1`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('malformatted id')
  })

  test('get user by id succeeds for ADMIN\'s own id if ADMIN login', async () => {
    const response = await api
      .get(`/api/users/${ADMINID}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.username).toBe('admin@admin.com')
  })

  test('get user by id succeeds for another USER id if ADMIN login', async () => {
    const response = await api
      .get(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.username).toBe('user@user.com')
  })

  test('get user by id fails for another USER id if USER login', async () => {
    const response = await api
      .get(`/api/users/${ADMINID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('you don´t have rights for this operation')
  })

  test('get user by id succeeds for USER\'s own id if USER login', async () => {
    const response = await api
      .get(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.username).toBe('user@user.com')
  })
})

describe('When there is initially one admin - user and two user - users at db : users post', () => {
  describe('When users are created', () => {

    test('There are two users at start', async () => {
      const usersAtStart = await helper.usersInDb()
      const response = await api
        .get('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
      expect(response.body).toHaveLength(usersAtStart.length)
    })

    test('USER creation fails if not logged', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.username = 'newUserUsername@newUserUsername.com'
      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toBe('invalid token')
    })

    test('USER creation fails if wrong/invalid token', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.username = 'newUserUsername@newUserUsername.com'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${WRONGTOKEN}`)
        .send(newUser)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toBe('invalid token')
    })

    test('USER creation fails if username already exists if ADMIN posts', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.username = 'user@user.com'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toBe('username must be unique')
    })

    test('USER creation fails if USER role tries to create a new user', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.username = 'newUserUsername@newUserUsername.com'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${USERTOKEN}`)
        .send(newUser)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toBe('you don´t have rights for this operation')
    })

    test('USER creation succees if ADMIN role creates a new user with proper credentials', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.username = 'newUserUsername@newUserUsername.com'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
      expect(response.body.username).toBe('newUserUsername@newUserUsername.com')
    })

    test('USER creation fails if email is invalid', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.username = 'invalidemail@'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toBe('invalid email address')
    })

    test('USER creation fails if password is too short', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.password = 'Admi!1'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toContain('password must be at least 8 characters long')
    })

    test('USER creation fails if password is missing a number', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.password = 'Admin@admin'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toContain('contain at least one lowercase letter, one uppercase letter, one number')
    })

    test('USER creation fails if password is missing a capital letter', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.password = 'admin@admin1'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toContain('contain at least one lowercase letter, one uppercase letter')
    })

    test('USER creation fails if password is missing a special character', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.password = 'Adminadmin1'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toContain('contain at least one lowercase letter, one uppercase letter, one number and one symbol')
    })

    test('USER creation fails if password is missing small letters', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.password = 'ADMIN@ADMIN1'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toContain('contain at least one lowercase letter')
    })

    test('USER creation fails if postal code is too short', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.postalCode = '1234'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toContain('invalid postal code')
    })

    test('USER creation fails if postal code is too long', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.postalCode = '123456'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toContain('invalid postal code')
    })

    test('USER creation fails if postal has non-numeric characters', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = helper.userUser()
      newUser.postalCode = '1234A'
      const response = await api
        .post('/api/users')
        .set('Authorization', `Bearer ${ADMINTOKEN}`)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
      expect(response.body.error).toContain('invalid postal code')
    })
  })

  describe('When user password is changed', () => {
    test('PASSWORD CHANGE fails if old password is wrong', async () => {
      const passwords = {
        oldPassword: 'bad',
        newPassword: 'User@user2',
        confirmNewPassword: 'User@user2'
      }
      const response = await api
        .post(`/api/users/${USERID}/password_change`)
        .set('Authorization', `Bearer ${USERTOKEN}`)
        .send(passwords)
        .expect(401)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toContain('old password does not match user password')
    })

    test('PASSWORD CHANGE fails if new password confirmation is wrong', async () => {
      const newUser = helper.userUser()
      const passwords = {
        oldPassword: newUser.password,
        newPassword: 'User@user2',
        confirmNewPassword: 'User@user3'
      }
      const response = await api
        .post(`/api/users/${USERID}/password_change`)
        .set('Authorization', `Bearer ${USERTOKEN}`)
        .send(passwords)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toContain('password confirmation does not match with new password')
    })

    test('PASSWORD CHANGE fails old password is same as new password', async () => {
      const newUser = helper.userUser()
      const passwords = {
        oldPassword: newUser.password,
        newPassword: newUser.password,
        confirmNewPassword: newUser.password
      }
      const response = await api
        .post(`/api/users/${USERID}/password_change`)
        .set('Authorization', `Bearer ${USERTOKEN}`)
        .send(passwords)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toContain('new password can\'t be same as old password')
    })

    test('PASSWORD CHANGE fails if new password fails validation', async () => {
      const newUser = helper.userUser()
      const passwords = {
        oldPassword: newUser.password,
        newPassword: 'user',
        confirmNewPassword: 'user'
      }
      const response = await api
        .post(`/api/users/${USERID}/password_change`)
        .set('Authorization', `Bearer ${USERTOKEN}`)
        .send(passwords)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toContain('password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one symbol')
    })

    test('PASSWORD CHANGE succeeds with correct values', async () => {
      const newUser = helper.userUser()
      const passwords = {
        oldPassword: newUser.password,
        newPassword: 'User@user2',
        confirmNewPassword: 'User@user2'
      }
      await api
        .post(`/api/users/${USERID}/password_change`)
        .set('Authorization', `Bearer ${USERTOKEN}`)
        .send(passwords)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    })
  })
})

describe('When there is initially one admin - user and two user - users at db : users delete', () => {

  test('ADMIN can delete USER', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api
      .delete(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length - 1)
    expect(response.body.message).toBe('user was deleted successfully')
  })

  test('USER deletion fails when no credentials', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api
      .delete(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(response.body.error).toBe('you don´t have rights for this operation')
  })

  test('USER deletion fails when no login', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api
      .delete(`/api/users/${USERID}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(response.body.error).toBe('invalid token')
  })

  afterAll(async () => {
    await initialize()
  })
})

describe('When user info is changed', () => {
  test('ADDRESS CHANGE succeeds with correct values', async () => {
    const userInputType = 'address'
    const userInput = 'TestStreet'

    const response = await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({
        userInputType, userInput
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.address).toBe(userInput)
    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.address).toBe(userInput)
  })

  test('POSTALCODE CHANGE succeeds with correct values', async () => {
    const userInputType = 'postalCode'
    const userInput = '00200'

    const response = await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({
        userInputType, userInput
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.postalCode).toBe(userInput)
    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.postalCode).toBe(userInput)
  })

  test('CITY CHANGE succeeds with correct values', async () => {
    const userInputType = 'city'
    const userInput = 'Espoo'

    const response = await api
      .put(`/api/users/${USERID}`)
      .send({
        userInputType, userInput
      })
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.city).toBe(userInput)
    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.city).toBe(userInput)
  })

  test('POSTALCODE CHANGE fails if postal code is too short', async () => {
    const userInputType = 'postalCode'
    const userInput = '1234'

    const response = await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({
        userInputType, userInput
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('invalid postal code')
    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.postalCode).not.toBe(userInput)
  })

  test('POSTALCODE CHANGE fails if postal code is too long', async () => {
    const userInputType = 'postalCode'
    const userInput = '123456'

    const response = await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({
        userInputType, userInput
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('invalid postal code')
    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.postalCode).not.toBe(userInput)
  })

  test('POSTALCODE CHANGE fails if postal has non-numeric characters', async () => {
    const userInputType = 'postalCode'
    const userInput = '1234A'

    const response = await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({
        userInputType, userInput
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('invalid postal code')
    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.postalCode).not.toBe(userInput)
  })

  test('CHANGE fails if WRONG userInputType', async () => {
    const userInputType = 'WrongType'
    const userInput = '1234A'

    const response = await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({
        userInputType, userInput
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('invalid userInputType')
  })
})

describe('When sender device is added to user', () => {
  test('SENDER DEVICE ADDITION succeeds with correct values', async () => {
    const userAtStart = await helper.userInDb(USERID)
    const lengthAtStart = userAtStart.senderDeviceIds.length

    const response = await api
      .put(`/api/users/${USERID}/addSenderDevice`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send({
        senderDeviceId: '123456789'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(response.body.senderDeviceIds).toContain('123456789')

    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.senderDeviceIds).toHaveLength(lengthAtStart + 1)
  })

  test('SENDER DEVICE ADDITION fails with invalid token', async () => {
    const userAtStart = await helper.userInDb(USERID)
    const lengthAtStart = userAtStart.senderDeviceIds.length

    const response = await api
      .put(`/api/users/${USERID}/addSenderDevice`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({
        senderDeviceId: '123456789'
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('you don´t have rights for this operation')

    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.senderDeviceIds).toHaveLength(lengthAtStart)
  })

  test('SENDER DEVICE ADDITION fails if sender device id is not given', async () => {
    const userAtStart = await helper.userInDb(USERID)
    const lengthAtStart = userAtStart.senderDeviceIds.length

    const response = await api
      .put(`/api/users/${USERID}/addSenderDevice`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send({})
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('sender device id must be given')

    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.senderDeviceIds).toHaveLength(lengthAtStart)
  })

  test('SENDER DEVICE ADDITION fails if sender device id already added to user', async () => {
    const userAtStart = await helper.userInDb(USERID)
    const lengthAtStart = userAtStart.senderDeviceIds.length

    const response = await api
      .put(`/api/users/${USERID}/addSenderDevice`)
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send({
        senderDeviceId: 'E00208B4'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toBe('sender device id already added to user')

    const userFromDb = await helper.userInDb(USERID)
    expect(userFromDb.senderDeviceIds).toHaveLength(lengthAtStart)
  })
})