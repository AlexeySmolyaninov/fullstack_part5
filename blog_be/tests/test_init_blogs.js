const Blog = require('../models/blog')
const initialBlogs = require('./dummyData')

const allBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, allBlogs
}