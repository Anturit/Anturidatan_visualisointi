const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const validator = require('validator')

usersRouter.get('/', async (request, response) => {
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
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {

  const user = await request.body
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

module.exports = usersRouter
