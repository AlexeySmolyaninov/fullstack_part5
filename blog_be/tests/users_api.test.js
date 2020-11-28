const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeAll(async () => {
  await User.deleteMany({})

  const userCri = {
    username: 'root',
    name: 'root',
    password: 'root'
  }

  const passwordHash = await bcrypt.hash(userCri.password, 10)

  const user = new User({
    username: userCri.username,
    name: userCri.name,
    passwordHash: passwordHash
  })

  await user.save()
})

describe('testing users API', () => {
  test('user\'s username should be unique', async() => {
    const response = await api
      .post('/api/users')
      .send({
        username: 'root',
        name: 'root',
        password: 'root'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('`username` to be unique')

  })
})