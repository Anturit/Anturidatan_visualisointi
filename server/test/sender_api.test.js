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

})

describe('When there is initially two senders at db', () => {
  test('Senders route returns same amount of users that are in database', async () => {
    const sendersAtStart = await helper.sendersInDb()
    const response = await api.get('/api/senders').set('Authorization', `Bearer ${ADMINTOKEN}`)
    expect(response.body).toHaveLength(sendersAtStart.length)
  })

  test('get all senders fails if not login', async () => {
    const response = await api
      .get('/api/senders')
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('invalid token')
  })
  test('get all senders fails if USER login', async () => {
    const response = await api
      .get('/api/senders')
      .set('Authorization', `Bearer ${ USERTOKEN }`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('you don´t have rights for this operation')
  })

  test('get all senders succees if ADMIN  login', async () => {
    await api
      .get('/api/senders')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('get existing sender by "device" succees if ADMIN  login', async () => {
    await api
      .get('/api/senders/E00208B4')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('get non-existing sender by "device" fails if ADMIN  login ', async () => {
    const response = await api
      .get('/api/senders/E00208B4DONTEXIST')
      .set('Authorization', `Bearer ${ADMINTOKEN}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('there´s no device with this id')
  })

  test('get existing sender by "device" fails if not login', async () => {
    const response = await api
      .get('/api/senders/E00208B4')
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('invalid token')
  })

  test('get sender by "device" fails if USER login and USER doesn´t own the device', async () => {
    const response = await api
      .get('/api/senders/1B2AF5B')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
    expect(response.body.error).toContain('this user is not the owner of the device')
  })

  test('get sender by "device" succeeds if USER login and USER owns the device', async () => {
    await api
      .get('/api/senders/E00208B4')
      .set('Authorization', `Bearer ${USERTOKEN}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})
