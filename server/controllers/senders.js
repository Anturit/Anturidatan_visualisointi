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
    .sort({ date: 'descending' })

  if (device.length === 0){
    return response.status(400).json({ error: 'there´s no device with this id' })
  }
  response.json(device)
})


module.exports = senderRouter
