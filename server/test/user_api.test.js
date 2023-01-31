
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

let ADMINTOKEN = ''
let USERTOKEN = ''
let WRONGTOKEN = ''

beforeAll(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('admin@admin', 10)

  const adminuser = new User({
    userName: 'admin@admin',
    role: 'admin',
    passwordHash: passwordHash,
    sensordataObjectIds: ['sensor1','sensor2']
  })

  await adminuser.save()

  const userdata = {
    userName: 'admin@admin',
    password: 'admin@admin',
  }
  const response = await supertest(app).post('/api/login').send(userdata)
  ADMINTOKEN = response.body.token

  const passwordHash2 = await bcrypt.hash('user@user', 10)

  const user = new User({
    userName: 'user@user',
    role: 'user',
    passwordHash: passwordHash2,
    sensordataObjectIds: ['sensor3','sensor4']
  })
  await user.save()
  const userdata2 = {
    username: 'user@user',
    password: 'user@user',
  }
  const response2 = await supertest(app).post('/api/login').send(userdata2)
  USERTOKEN = response2.body.token

  WRONGTOKEN = 'this_is_a_wrong_token'

})

describe('When there is initially one admin-user and one user-user at db', () => {
  test('There are two users at start', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(usersAtStart.length )
  })  

  test('USER creation fails if not logged', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToBeCreated = {
      userName: 'newuser',
      firstName: 'New User',
      role: 'user',
      password: 'somepasswordhash',
    }
    await api
      .post('/api/users')
      .send(userToBeCreated)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('USER creation fails if wrong/invalid token', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToBeCreated = {
      username: 'newuser',
      name: 'New User',
      role: 'user',
      password: 'somepasswordhash',
    }
    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${WRONGTOKEN}`)
      .send(userToBeCreated)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('USER creation fails if username already exists if ADMIN posts', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToBeCreated = {
      username: 'user',
      name: 'New User',
      role: 'user',
      password: 'somepasswordhash',
    }
    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(userToBeCreated)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('USER creation fails if USER role tries to create a new user', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToBeCreated = {
      username: 'newuser',
      name: 'New User',
      role: 'user',
      password: 'somepasswordhash',
    }
    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .send(userToBeCreated)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('USER creation succees if ADMIN role creates a new user with proper credentials', async () => {
    const usersAtStart = await helper.usersInDb()
    const userToBeCreated = {
      username: 'newuser',
      name: 'New User',
      role: 'user',
      password: 'somepasswordhash',
    }
    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .send(userToBeCreated)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  })
 
})
