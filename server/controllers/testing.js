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

  const passwordAdmin = 'admin'
  const passwordHashAdmin = await bcrypt.hash(passwordAdmin, saltRounds)
  const admin = new User({
    username: 'admin',
    name: 'admin',
    role: 'admin',
    passwordHash: passwordHashAdmin
  })

  const savedAdmin = await admin.save()
  response.status(201).json(savedAdmin)
})

module.exports = router
