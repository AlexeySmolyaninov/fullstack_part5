const dummy = (blogs) => {
  blogs.lengh
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 ?
    0 : blogs.reduce((acc, blog) => acc + blog.likes,0)
}

const favoriteBlog = (blogs) => {
  if(!blogs || !blogs.length)
    return null

  return blogs.reduce((acc, blog) => {
    return acc.likes > blog.likes ?
      acc :
      {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      }
  },{ likes: 0 })
}

const mostBlogs = (blogs) => {
  if(!blogs || !blogs.length)
    return null

  const blogsByAuthor = new Map()

  blogs.forEach(blog => {
    if(blogsByAuthor.has(blog.author)){
      const foundedBlog = blogsByAuthor.get(blog.author)
      foundedBlog.blogs += 1
    }
    else {
      blogsByAuthor.set(blog.author, { author: blog.author, blogs: 1 })
    }
  })
  return Array.from(blogsByAuthor.values()).reduce((acc, item) => {
    return item.blogs > acc.blogs ? item : acc
  }, { blogs: 0 })
}

const mostLikes = (blogs) => {
  if(!blogs || !blogs.length)
    return null

  const blogsByAuthor = new Map()

  blogs.forEach(blog => {
    if(blogsByAuthor.has(blog.author)){
      const foundedBlog = blogsByAuthor.get(blog.author)
      foundedBlog.likes += blog.likes
    }
    else {
      blogsByAuthor.set(blog.author, { author: blog.author, likes: blog.likes })
    }
  })
  return Array.from(blogsByAuthor.values()).reduce((acc, item) => {
    return item.likes > acc.likes ? item : acc
  }, { likes: 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}