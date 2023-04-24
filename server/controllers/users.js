const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const validator = require('validator')
const { adminCredentialsValidator } = require('../utils/middleware')

usersRouter.get('/', adminCredentialsValidator, async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const loggedUser = request.user
  const userId = request.params.id

  if (loggedUser.role === 'user' && loggedUser.id !== userId) {
    return response.status(401).json({ error: 'you don´t have rights for this operation' })
  }

  const user = await User.findById(userId)
  return response.json(user)
})

// Admin only, POST new user to db only if user creation field requirements and validations are fullfilled
usersRouter.post('/', adminCredentialsValidator, async (request, response) => {

  const user = await request.body

  if (!(user.username && user.password)) {
    return response.status(400).json({
      error: 'username and password must be given',
    })
  }

  if (!validator.isStrongPassword(user.password, {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1 })) {
    return response.status(400).json({
      error: 'password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one symbol'
    })
  }

  if (!(validator.isLength(user.postalCode, { min: 5, max: 5 })
      && validator.isNumeric(user.postalCode, { no_symbols: true }))) {
    return response.status(400).json({
      error: 'invalid postal code'
    })
  }

  if (!(validator.isEmail(user.username))) {
    return response.status(400).json({
      error: 'invalid email address'
    })
  }

  const existingUser = await User.findOne({ username: user.username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }

  const saltRounds = 10
  user.passwordHash = await bcrypt.hash(user.password, saltRounds)
  delete user.password
  const userToSave = new User(user)
  const savedUser = await userToSave.save()
  response.status(201).json(savedUser)
})

usersRouter.delete('/:id', adminCredentialsValidator, async (request, response) => {
  const userIdToBeRemoved = request.params.id

  await User.findByIdAndRemove(userIdToBeRemoved)
  return response.status(200).json({ message: 'user was deleted successfully' })

})

usersRouter.post('/:id/password_change', async (request, response) => {
  const userId = request.params.id
  const user = await User.findById(userId)

  const oldPassword = request.body.oldPassword

  const oldPasswordMatches = await bcrypt.compare(oldPassword, user.passwordHash)

  if (!oldPasswordMatches) {
    return response.status(401).json({ error: 'old password does not match user password' })
  }

  const newPassword = request.body.newPassword
  const confirmNewPassword = request.body.confirmNewPassword

  if (newPassword !== confirmNewPassword) {
    return response.status(400).json({ error: 'password confirmation does not match with new password' })
  }

  if (oldPassword === confirmNewPassword) {
    return response.status(400).json({ error: 'new password can\'t be same as old password' })
  }

  if (!validator.isStrongPassword(confirmNewPassword, {
    minLength: 8,
    minLowerCase: 1,
    minUpperCase: 1,
    minNumbers: 1,
    minSymbols: 1 })) {
    return response.status(400).json({
      error: 'password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one symbol'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(confirmNewPassword, saltRounds)

  await User.updateOne(
    { _id: userId },
    { $set: { passwordHash: passwordHash } },
    { new: true }
  )

  const changedUser = await User.findById(userId)

  response.status(201).json(changedUser)

})

usersRouter.put('/:id', async (request, response) => {

  const userInputType = request.body.userInputType
  const userInput = request.body.userInput
  const userId = request.params.id

  if (!['address', 'city', 'postalCode'].includes(userInputType)) {
    return response.status(400).json({
      error: 'invalid userInputType'
    })
  }
  if (userInputType === 'postalCode'
  && !(validator.isLength(userInput, { min: 5, max: 5 })
  && validator.isNumeric(userInput, { no_symbols: true }))) {
    return response.status(400).json({
      error: 'invalid postal code'
    })
  }

  await User.updateOne(
    { _id: userId },
    { $set: { [userInputType]: userInput } },
    { new: true }
  )
  const changedUser = await User.findById(userId)
  response.status(200).json(changedUser)

})

usersRouter.put('/:id/changeUserDetails', adminCredentialsValidator, async (request, response) => {
  const userId = request.params.id
  const newEmail = request.body.username
  const newExpirationDate = request.body.expirationDate

  const updatedDetails = { username: newEmail, expirationDate: newExpirationDate }

  if (newEmail === undefined) {
    return response.status(400).json({
      error: 'email must be given'
    })
  }

  if (!newExpirationDate) {
    return response.status(400).json({
      error: 'expiration date must be given'
    })
  }

  if (newEmail && !(validator.isEmail(newEmail))) {
    return response.status(400).json({
      error: 'invalid email address'
    })
  }

  const existingUser = await User.findOne({ username: newEmail })

  if (newEmail && existingUser && existingUser._id.toString() !== userId) {
    return response.status(400).json({ error: 'this email is already in use' })
  }

  await User.findOneAndUpdate(
    { _id: userId },
    { $set: updatedDetails },
    { new: true }
  )
  const changedUser = await User.findById(userId)
  response.status(200).json(changedUser)
})

usersRouter.put('/:id/addSenderDevice', adminCredentialsValidator, async (request, response) => {
  const senderDeviceId = request.body.senderDeviceId

  if (!senderDeviceId) {
    return response.status(400).json({
      error: 'sender device id must be given'
    })
  }

  const userId = request.params.id
  const user = await User.findById(userId)

  if (user.senderDeviceIds.includes(senderDeviceId)) {
    return response.status(400).json({
      error: 'sender device id already added to user'
    })
  }

  await User.updateOne(
    { _id: userId },
    { $push: { senderDeviceIds: senderDeviceId } },
    { new: true }
  )

  const changedUser = await User.findById(userId)
  response.status(200).json(changedUser)
})

usersRouter.put('/:id/deleteSenderDevice', adminCredentialsValidator, async (request, response) => {
  const senderDeviceId = request.body.senderDeviceId
  const userId = request.params.id
  const user = await User.findById(userId)

  if (!senderDeviceId) {
    return response.status(400).json({
      error: 'sender device id must be given'
    })
  }

  if (!user.senderDeviceIds.includes(senderDeviceId)) {
    return response.status(400).json({
      error: 'sender device id not found in user'
    })
  }

  await User.updateOne(
    { _id: userId },
    { $pull: { senderDeviceIds: senderDeviceId } },
    { new: true }
  )

  return response.status(200).json({ message: 'sender device id was deleted successfully' })

})

module.exports = usersRouter
