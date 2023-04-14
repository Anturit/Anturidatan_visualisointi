const senderRouter = require('express').Router()
const Sender = require('../models/sender')
const { adminCredentialsValidator } = require('../utils/middleware')

// Admin only route to get all sender logs
senderRouter.get('/', adminCredentialsValidator, async (request, response) => {
  const senders = await Sender.find({}).sort({ date: 'descending' })
  response.json(senders)
})

// User and Admin route to get all sender logs from a device
senderRouter.get('/:id', async (request, response) => {
  const user = request.user

  if (user.role === 'user' && !user.senderDeviceIds.includes(request.params.id)) {
    return response.status(401).json({ error: 'this user is not the owner of the device' })
  }

  const device = await Sender
    .find({ device: { $in: request.params.id } })
    .sort({ date: 'ascending' })
  if (device.length === 0){
    return response.status(400).json({ error: 'there´s no device with this id' })
  }
  response.json(device)
})

senderRouter.get('/:id/:year', async (request, response) => {
  const user = request.user
  const year = request.params.year

  if (user.role === 'user' && !user.senderDeviceIds.includes(request.params.id)) {
    return response.status(401).json({ error: 'this user is not the owner of the device' })
  }

  const device = await Sender
    .find({ device: { $in: request.params.id }, date: { $gte: new Date(`${year}`), $lte: new Date(`${year + 1}`) } })
    .sort({ date: 'ascending' })

  if (device.length === 0){
    return response.status(404).json({ error: 'no data found for the given year' })
  }
  response.json(device)
})

senderRouter.post('/', adminCredentialsValidator, async (request, response) => {
  const dataPoints = await request.body
  if (!Array.isArray(dataPoints))
    return response.status(400).json({ error: 'request content must be an array' })
  dataPoints.forEach(
    dataPoint => dataPoint['date'] = new Date(dataPoint.date)
  )
  const insertResult = await Sender.insertMany(dataPoints, { rawResult: true })
  if (insertResult.insertedCount !== dataPoints.length) {
    return response.status(400).json({ error: 'some data points were not inserted' })
  }
  return response.status(201).end()
})

module.exports = senderRouter
