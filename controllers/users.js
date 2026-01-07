const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
// const logger = require('../utils/logger')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({})
    return res.json(users)
})

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body
    if (!password) {
        return res.status(400).json({ error: 'password is required' })
    }
    else if (password.length <= 2) {
        // logger.error('Password length less than 3, therefore invalid')
        return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()
    return res.status(201).json(savedUser)
})

module.exports = usersRouter