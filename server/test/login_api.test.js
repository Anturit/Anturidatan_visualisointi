
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeAll(async () => {
  await User.deleteMany({})
  await supertest(app)
    .post('/api/testing/reset')
    .expect(201)
})

describe('When there is initially one admin-user and two user-users at db', () => {
  test('Users route retuns same amount of users that are in database', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(usersAtStart.length)
  })


  test('login succees with proper username and password when ADMIN', async () => {
    const userdata = {
      username: 'admin@admin',
      password: 'admin@admin',
    }

    const response = await api
      .post('/api/login')
      .send(userdata)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.username).toBe('admin@admin')

  })

  test('login succees with proper username and password when USER', async () => {
    const userdata = {
      username: 'user@user',
      password: 'user@user',
    }

    const response = await api
      .post('/api/login')
      .send(userdata)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.username).toBe('user@user')
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
      username: 'user@user',
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
