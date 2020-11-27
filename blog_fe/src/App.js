import React, { useState, useEffect, useRef } from 'react'
import { Blog, CreateBlogForm } from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    if(user){
      const retrieveBlogs = async () => {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      }
      retrieveBlogs()
    }
  }, [ user ])

  useEffect(() => {
    const loggeduserJSON = window.localStorage.getItem('user')
    if(loggeduserJSON){
      const user = JSON.parse(loggeduserJSON)
      setUser(user)
    }
  }, [])

  const handleLogOut = () => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

  const handleNotification = (message) => setNotification(message)

  const removeBlogFromList = removedBlogId => setBlogs(
    blogs.filter(blog => blog.id !== removedBlogId)
  )

  const blogForm = () => (
    <Togglable
      buttonLabelOpen='new blog'
      buttonLabelClose='cancel'
      ref={blogFormRef}>
      <CreateBlogForm
        updateBlogList= {(blog) => {
          blogFormRef.current.toggleVisible()
          setBlogs(blogs.concat(blog))
        }
        }
        handleNotification={handleNotification}
      />
    </Togglable>
  )

  return (
    <div>
      {notification && <Notification notification={notification}/>}
      {user === null &&
        <LoginForm
          handleUser={(userDetails) => setUser(userDetails)}
          handleNotification={handleNotification}
        />
      }:

      {user && (
        <>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogOut}>logout</button></p>
          {blogForm()}
          {blogs
            .sort((fBlog, sBlog) => sBlog.likes - fBlog.likes)
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateBlogHandle={(updatedBlog) => setBlogs(
                  blogs.map(blog => {
                    if(blog.id === updatedBlog.id){
                      blog.likes += 1
                      return blog
                    }
                    return blog
                  })
                )}
                removeBlogHandle={removeBlogFromList}
              />
            )}
        </>
      )}
    </div>
  )
}

export default App