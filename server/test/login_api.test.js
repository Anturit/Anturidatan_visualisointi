
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

beforeAll(async () => {
  await supertest(app)
    .post('/api/testing/reset')
    .expect(201)
})

describe('When there is initially one admin-user and two user-users at db', () => {

  test('login succees with proper username and password when ADMIN', async () => {
    const userdata = {
      username: 'admin@admin',
      password: 'Admin@admin1',
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
      password: 'User@user1',
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
    const response = await api
      .post('/api/login')
      .send(userdata)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('invalid username or password')
  })

  test('login fails with proper username and wrong password when USER', async () => {
    const userdata = {
      username: 'user@user',
      password: 'adminPasswordWrong',
    }

    const response = await api
      .post('/api/login')
      .send(userdata)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('invalid username or password')
  })

  test('login fails with wrong username and wrong password when ADMIN', async () => {
    const userdata = {
      username: 'adminWrong',
      password: 'adminPasswordWrong',
    }

    const response = await api
      .post('/api/login')
      .send(userdata)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('invalid username or password')
  })

  test('login fails if USER expirationDate out of date', async () => {
    const userdata = {
      username: 'expireduser@user',
      password: 'Expireduser@user1',
    }

    const response = await api
      .post('/api/login')
      .send(userdata)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('user expired, access denied, contact admin')
  })
})
