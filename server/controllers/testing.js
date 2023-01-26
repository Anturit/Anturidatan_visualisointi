const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
router.post('/reset', async (request, response) => {
  await User.deleteMany({})

  const password = 'testpassword'
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    name: 'testuser',
    username: 'testuser',
    passwordHash: passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = router
