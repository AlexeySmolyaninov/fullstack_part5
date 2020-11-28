const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = require('../app')
const { SECRET } = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs } = require('./test_init_blogs')
const helper = require('./test_init_blogs')

const api = supertest(app)
let token = ''
let decodedToken = null
beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('root', 10)
  const user = new User({ username: 'root', name: 'root', passwordHash })

  await user.save()

  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'root' })

  token = response.body.token
  decodedToken = jwt.verify(token, SECRET)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogs = helper.initialBlogs

  for(let blog of blogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET /api/blogs', () => {
  test('check the size of returned all notes', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('check to include a specific note', async () => {
    const blogsFromDB = await helper.allBlogs()
    const res = await api
      .get('/api/blogs')

    expect(res.body).toContainEqual(JSON.parse(JSON.stringify(blogsFromDB[0])))
  })

  test('check that an blog object will have a ID property', async () => {
    const blogsFromDB = await helper.allBlogs()
    blogsFromDB.forEach(blog => expect(blog).toBeDefined())
  })
})

describe('POST /api/blogs', () => {
  test('persist a valid blog', async () => {
    const newBlog = {
      title: 'My own title',
      url: 'https://alexsmol.com',
      likes: 100
    }

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsFromDB = await helper.allBlogs()
    expect(blogsFromDB).toHaveLength(helper.initialBlogs.length + 1)

    expect(blogsFromDB.map(blog => blog.title))
      .toContainEqual(newBlog.title)
  })

  test('persist blog without likes', async () => {
    const newBlog = {
      title: 'Super header',
      author: 'Alex Smol',
      url: 'https://alexsmol.com'
    }
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsFromDB = await helper.allBlogs()
    const foundBlog = blogsFromDB.find(blog => blog.title === 'Super header')
    expect(foundBlog.likes).toEqual(0)
  })

  test('persist invalid blog without title and url', async () => {
    const newBlog = {
      author: 'Alex Smol',
      like: 5
    }
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE /api/blogs', () => {
  test('delete own blog', async () => {
    const newBlog = {
      title: 'My own title',
      url: 'https://alexsmol.com',
      likes: 100
    }

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const blogsFromDB = await helper.allBlogs()
    const blog = blogsFromDB.find(blog => {
      if(blog.user &&
        blog.user.toString() === decodedToken.userId) {
        return blog
      }
    })
    await api
      .delete(`/api/blogs/${blog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const blogsFromDBAfterDelete = await helper.allBlogs()
    expect(blogsFromDBAfterDelete).toHaveLength(initialBlogs.length)
    expect(blogsFromDBAfterDelete.map(blog => blog.id)).not.toContain(blog.id)
  })
})

describe('PUT /api/blogs', () => {
  test('update blog\'s amount of likes', async () => {
    const blogsFromDB = await helper.allBlogs()
    const blog = blogsFromDB[0]
    const blogToUpdate = { ...blog, likes: 50 }

    await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)

    const blogsFromDBAfterUpdate = await helper.allBlogs()
    expect(blogsFromDBAfterUpdate.find(blog => blog.id === blogToUpdate.id).likes)
      .toEqual(blogToUpdate.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})