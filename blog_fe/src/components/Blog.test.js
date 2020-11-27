import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { Blog, BlogExtraDetails } from './Blog'

const dummyBlog = {
  title: 'Dummy title',
  author: 'Alex',
  likes: 33,
  url:'some.com',
  user: { username:'alex' }
}

const dummyUser = {
  username: 'alex'
}

describe('Testing Blog component', () => {
  test('Check that Blog component displays blog\'s title and author but not likes and url', () => {

    const blogComponent = render(
      <Blog blog={ dummyBlog }/>
    )

    expect(blogComponent.container).toHaveTextContent(dummyBlog.title)

    expect(blogComponent.container).toHaveTextContent(dummyBlog.author)

    expect(blogComponent.container).not.toHaveTextContent(dummyBlog.likes)

    expect(blogComponent.container).not.toHaveTextContent(dummyBlog.url)
  })

  test('show blog\'s title, author, likes, url properties', () => {
    const blogComponent = render(
      <Blog
        blog={ dummyBlog }
        user= {dummyUser}
      />
    )

    const button = blogComponent.container.querySelector('button')
    fireEvent.click(button)

    expect(blogComponent.container).toHaveTextContent(dummyBlog.title)

    expect(blogComponent.container).toHaveTextContent(dummyBlog.author)

    expect(blogComponent.container).toHaveTextContent(dummyBlog.likes)

    expect(blogComponent.container).toHaveTextContent(dummyBlog.url)
  })

  test('test blog\'s "like" functionality', () => {
    const likeBlog = jest.fn()

    const blogComponent = render(
      <BlogExtraDetails
        blog={dummyBlog}
        user={dummyUser}
        handleLikeFunc={likeBlog}
      />
    )

    const likeButton = blogComponent.container.querySelector('#like-btn')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })

  /*test('create new blog via form', async () => {
    const updateBlogList = jest.fn()
    const handleNotification = jest.fn()

    const component = render(
      <CreateBlogForm
        handleNotification={handleNotification}
        updateBlogList={updateBlogList}
      />
    )


    const blogTitleInput = component.container.querySelector('#blog-title')
    const blogAuthor = component.container.querySelector('#blog-author')
    const blogUrl = component.container.querySelector('#blog-url')
    const form = component.container.querySelector('#blog-form')
    fireEvent.change(blogTitleInput, {
      target: { value: dummyBlog.title }
    })
    fireEvent.change(blogAuthor, {
      target: { value: dummyBlog.author }
    })
    fireEvent.change(blogUrl, {
      target: { value: dummyBlog.url }
    })

    fireEvent.submit(form)
    expect(updateBlogList.mock.calls).toHaveLength(1)
  })*/

})