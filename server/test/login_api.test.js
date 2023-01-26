
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')


beforeAll(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('adminPassword', 10)

  const adminuser = new User({
    username: 'admin',
    name: 'A. Admin',
    role: 'admin',
    passwordHash: passwordHash,
    sensordataObjectIds: ['sensor1','sensor2']
  })

  await adminuser.save()
  const userdata = {
    username: 'admin',
    password: 'adminPassword',
  }
  await supertest(app).post('/api/login').send(userdata)
  const passwordHash2 = await bcrypt.hash('userPassword', 10)

  const user = new User({
    username: 'user',
    name: 'U. User',
    role: 'user',
    passwordHash: passwordHash2,
    sensordataObjectIds: ['sensor3','sensor4']
  })
  await user.save()
  const userdata2 = {
    username: 'user',
    password: 'userPassword',
  }
  await supertest(app).post('/api/login').send(userdata2)
})

describe('When there is initially one admin-user and one user-user at db', () => {
  test('There are two users at start', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(usersAtStart.length)
  })


  test('login succees with proper username and password when ADMIN', async () => {
    const userdata = {
      username: 'admin',
      password: 'adminPassword',
    }

    const response = await api
      .post('/api/login')
      .send(userdata)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.username).toBe('admin')

  })

  test('login succees with proper username and password when USER', async () => {
    const userdata = {
      username: 'user',
      password: 'userPassword',
    }

    const response = await api
      .post('/api/login')
      .send(userdata)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.username).toBe('user')
  })

  test('login fails with proper username and wrong password when ADMIN', async () => {
    const userdata = {
      username: 'admin',
      password: 'adminPasswordWrong',
    }
    await api
      .post('/api/login')
      .send(userdata)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login fails with proper username and wrong password when USER', async () => {
    const userdata = {
      username: 'user',
      password: 'adminPasswordWrong',
    }

    await api
      .post('/api/login')
      .send(userdata)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('login fails with wrong username and wrong password when ADMIN', async () => {
    const userdata = {
      username: 'adminWrong',
      password: 'adminPasswordWrong',
    }

    await api
      .post('/api/login')
      .send(userdata)
      .expect(401)
      .expect('Content-Type', /application\/json/)

  })
})
