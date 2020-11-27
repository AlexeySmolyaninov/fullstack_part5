import React, { useState } from 'react'
import blogService from '../services/blogs'

export const BlogExtraDetails = ({
  blog,
  user,
  removeBlogHandle,
  handleLikeFunc
}) => {

  const handleRemoveBlog = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      const statusCode = await blogService.deleteBlog(blog.id)
      if(statusCode === 200) {
        removeBlogHandle(blog.id)
      }
    }
  }

  return (
    <div className='blog-extra-details'>
      <p>{blog.url}</p>
      <p className='likes'>{blog.likes}
        <button
          id='like-btn'
          onClick={handleLikeFunc}>
          like
        </button>
      </p>
      <p>{blog.author}</p>
      {user.username === blog.user.username &&
        <button onClick={handleRemoveBlog}>remove</button>
      }
    </div>
  )
}
export const Blog = ({ blog, user, updateBlogHandle, removeBlogHandle }) => {
  const [showExtraDetails, setShowExtraDetails] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('view')
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonFunc = () => {
    if(!showExtraDetails) {
      setShowExtraDetails(true)
      setButtonLabel('hide')
      return
    }
    setShowExtraDetails(false)
    setButtonLabel('view')
  }

  const handleLikeFunc = async () => {
    const updateBlog = await blogService.updateBlog({
      id: blog.id,
      likes: blog.likes + 1
    })
    updateBlogHandle(updateBlog)
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={buttonFunc}>{buttonLabel}</button>
      {showExtraDetails &&
        <BlogExtraDetails
          blog={blog}
          user={user}
          updateBlogHandle={updateBlogHandle}
          removeBlogHandle={removeBlogHandle}
          handleLikeFunc={handleLikeFunc}
        />}
    </div>
  )
}

export const CreateBlogForm = ({
  updateBlogList,
  handleNotification,
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try{
      const blog = await blogService.createBlog({
        title,
        author,
        url
      })
      updateBlogList(blog)
      handleNotification({
        message: `A new blog ${blog.title} by ${blog.author} added`,
        isErro: false
      })
      setTimeout(() => handleNotification(''), 3000)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch(exception) {
      handleNotification({
        message: 'Blog hasn\'t been created',
        isError: true
      })
      setTimeout(() => handleNotification(''), 3000)
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <div>
      <h2>Create new Blog</h2>
      <form
        id='blog-form'
        onSubmit={ handleCreateBlog }>
        <div>
          <label>title:</label>
          <input
            id='blog-title'
            type='text'
            onChange={({ target }) => setTitle(target.value)}
            value={title}
          />
        </div>
        <div>
          <label>author:</label>
          <input
            id='blog-author'
            type='text'
            onChange={({ target }) => setAuthor(target.value)}
            value={ author }
          />
        </div>
        <div>
          <label>url:</label>
          <input
            id='blog-url'
            type='text'
            onChange={({ target }) => setUrl(target.value)}
            value={url}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}
