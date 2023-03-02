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

  if (user.role === 'user' && user.id !== userId) {
    return response.status(401).json({ error: 'you don´t have rights for this operation' })
  }

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

module.exports = usersRouter
