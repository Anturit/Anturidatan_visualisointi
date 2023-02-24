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
  const userID = request.params.id

  if (loggedUser.role === 'user' && loggedUser.id !== userID) {
    return response.status(401).json({ error: 'you don´t have rights for this operation' })
  }

  const user = await User.findById(userID)
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

module.exports = usersRouter
