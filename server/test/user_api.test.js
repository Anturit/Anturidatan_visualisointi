const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

let ADMINTOKEN = ''
let USERTOKEN = ''
let WRONGTOKEN = ''

let ADMINID = ''
let USERID = ''

beforeAll(async () => {
  const savedUsers = await supertest(app)
    .post('/api/testing/reset')
    .expect(201)

  ADMINID = savedUsers.body[2].id
  USERID = savedUsers.body[0].id

  const userdata = {
    username: 'admin@admin.com',
    password: 'Admin@admin1',
  }
  const response = await supertest(app).post('/api/login').send(userdata)
  ADMINTOKEN = response.body.token

  const userdata2 = {
    username: 'user@user.com',
    password: 'User@user1',
  }
  const response2 = await supertest(app).post('/api/login').send(userdata2)
  USERTOKEN = response2.body.token

  WRONGTOKEN = 'this_is_a_wrong_token'

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

describe('When user info is changed', () => {
  test('ADDRESS CHANGE succeeds with correct values', async () => {
    const newValue = 'address'
    const newInput = 'TestStreet'
    const updatedUser = {
      newValue, newInput
    }

    await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({ USERID }, updatedUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('POSTALCODE CHANGE succeeds with correct values', async () => {
    const newValue = 'postalCode'
    const newInput = '00200'
    const updatedUser = {
      newValue, newInput
    }

    await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({ USERID }, updatedUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  //test('POSTALCODE CHANGE fails if postal code is too short', async () => {
  //  const newValue = 'postalCode'
  //  const newInput = '1234'
  //  const updatedUser = {
  //    newValue, newInput
  //  }
  //  const response = await api
  //    .put(`/api/users/${USERID}`)
  //    .set('Authorization', `Bearer ${USERTOKEN}`)
  //    .send({ USERID }, updatedUser)
  //    .expect(400)
  //    .expect('Content-Type', /application\/json/)
  //  expect(response.body.error).toBe('invalid postal code')
  //})
  //
  //test('POSTALCODE CHANGE fails if postal code is too long', async () => {
  //  const newValue = 'postalCode'
  //  const newInput = '123456'
  //  const updatedUser = {
  //    newValue, newInput
  //  }
  //  const response = await api
  //    .put(`/api/users/${USERID}`)
  //    .set('Authorization', `Bearer ${USERTOKEN}`)
  //    .send({ USERID }, updatedUser)
  //    .expect(400)
  //    .expect('Content-Type', /application\/json/)
  //  expect(response.body.error).toBe('invalid postal code')
  //})
  //
  //test('POSTALCODE CHANGE fails if postal has non-numeric characters', async () => {
  //  const newValue = 'postalCode'
  //  const newInput = '1234A'
  //  const updatedUser = {
  //    newValue, newInput
  //  }
  //  const response = await api
  //    .put(`/api/users/${USERID}`)
  //    .set('Authorization', `Bearer ${USERTOKEN}`)
  //    .send({ USERID }, updatedUser)
  //    .expect(400)
  //    .expect('Content-Type', /application\/json/)
  //  expect(response.body.error).toBe('invalid postal code')
  //})

  test('CITY CHANGE succeeds with correct values', async () => {
    const newValue = 'city'
    const newInput = 'Espoo'
    const updatedUser = {
      newValue, newInput
    }

    await api
      .put(`/api/users/${USERID}`)
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send({ USERID }, updatedUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
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
})