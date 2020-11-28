const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

userRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('blogs', {
      url: 1,
      title: 1,
      author: 1
    })
  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const body = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: passwordHash
  })

  const savedUser = await user.save()

  res.json(savedUser)
})

module.exports = userRouter