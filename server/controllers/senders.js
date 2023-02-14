const senderRouter = require('express').Router()
const Sender = require('../models/sender')
const jwt = require('jsonwebtoken')

senderRouter.get('/', async (request, response) => {
  await request.body
  const token = await request.token
  const decodedToken = await jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (decodedToken.role !== 'admin') {
    return response
      .status(401)
      .json({ error: 'you don´t have rights for this operation' })
  }
  const senders = await Sender.find({}).sort({ date: 'descending' })
  response.json(senders)
})

senderRouter.get('/:id', async (request, response) => {
  await request.body
  const token = await request.token
  const decodedToken = await jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const device = await Sender
    .find({ device: { $in: request.params.id } })
    .sort({ date: 'descending' })
  response.json(device)
})


module.exports = senderRouter
