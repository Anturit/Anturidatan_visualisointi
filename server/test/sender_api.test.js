const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

let ADMINTOKEN = ''
let USERTOKEN = ''
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

})

describe('When there is initially two senders at db', () => {
  test('Senders route returns same amount of users that are in database', async () => {
    const sendersAtStart = await helper.sendersInDb()
    const response = await api.get('/api/senders').set('Authorization', `Bearer ${ADMINTOKEN}`)
    expect(response.body).toHaveLength(sendersAtStart.length)
  })

  test('get all senders fails if not login', async () => {
    await api
      .get('/api/senders')
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
  test('get all senders fails if USER login', async () => {
    await api
      .get('/api/senders')
      .set('Authorization', `Bearer ${ USERTOKEN }`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('get all senders succees if ADMIN  login', async () => {
    await api
      .get('/api/senders')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})