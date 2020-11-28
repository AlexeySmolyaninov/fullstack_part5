const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()

const { SECRET } = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')



blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, SECRET)
  if(!request.token || !decodedToken.userId) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.userId)

  const newBlog = {
    title: body.title,
    author: body.author || '',
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  }
  //newBlog.likes = newBlog.likes || 0

  if(!newBlog.title || !newBlog.url || !user){
    return response.status(400).end()
  }

  const savedBlog = await new Blog(newBlog).save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const savedBlogWithUser = await Blog.populate(savedBlog, { path: 'user', select:'username' })
  response.status(201).json(savedBlogWithUser)
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, SECRET)
  if(!decodedToken) {
    return response.status(401).send({
      error: 'you should be authorized to perform this actoin'
    })
  }

  const id = request.params.id
  const blog = await Blog.findById(id)
  if(decodedToken.userId.toString() !== blog.user.toString()){
    return response.status(401).send({
      error: 'you can delete only you own blogs posts'
    })
  }

  await Blog.findByIdAndRemove(id)
  response.status(200).end()
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const body = request.body
  const blog = { likes: body.likes }

  const updateBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
  response.json(updateBlog)
})

module.exports = blogRouter