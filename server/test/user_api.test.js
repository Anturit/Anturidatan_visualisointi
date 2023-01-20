const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

let ADMINTOKEN = ''
let USERTOKEN = ''

beforeAll(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)

  const adminuser = new User({
    username: 'adminuser',
    name: 'A. Admin',
    role: 'admin',
    password: passwordHash,
    sensordataObjectIds: ['sensor1','sensor2']
  })
  await adminuser.save()
  const userdata = {
    username: 'adminuser',
    password: 'sekret',
  }
  const response = await supertest(app).post('/api/login').send(userdata)
  ADMINTOKEN = response.body.token

  const passwordHash2 = await bcrypt.hash('sekret2', 10)

  const useruser = new User({
    username: 'useruser',
    name: 'U. User',
    role: 'user',
    password: passwordHash,
    sensordataObjectIds: ['sensor3','sensor4']
  })
  const userdata2 = {
    username: 'useruser',
    password: 'sekret2',
  }
  const response2 = await supertest(app).post('/api/login').send(userdata2)
  USERTOKEN = response2.body.token
})

describe('when there is initially one admin-user and one user-user at db', () => {
  test('There are two users at start', async () => {
    const usersAtStart = await helper.usersInDb()
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(usersAtStart.length)
  })
})

