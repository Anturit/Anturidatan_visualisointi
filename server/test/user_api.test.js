
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

let ADMINTOKEN = ''
let USERTOKEN = ''
let WRONGTOKEN = ''

beforeAll(async () => {
  await supertest(app)
    .post('/api/testing/reset')
    .expect(201)

  const userdata = {
    username: 'admin@admin',
    password: 'Admin@admin1',
  }
  const response = await supertest(app).post('/api/login').send(userdata)
  ADMINTOKEN = response.body.token

  const userdata2 = {
    username: 'user@user',
    password: 'user@user',
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
    expect(response.body.error).toBe('invalid token')
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

describe('When there is initially one admin - user and two user - users at db : users post', () => {

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
    newUser.username = 'newUserUsername@newUserUsername'
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
    newUser.username = 'newUserUsername@newUserUsername'
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
    newUser.username = 'user@user'
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
    newUser.username = 'newUserUsername@newUserUsername'
    const response = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send(newUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(response.body.error).toBe('invalid token')
  })

  test('USER creation succees if ADMIN role creates a new user with proper credentials', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = helper.userUser()
    newUser.username = 'newUserUsername@newUserUsername'
    const response = await api
      .post('/api/users')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    expect(response.body.username).toBe('newUserUsername@newUserUsername')
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



