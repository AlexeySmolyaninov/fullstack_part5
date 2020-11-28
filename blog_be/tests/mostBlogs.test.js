const mostBlogs = require('../utils/list_helper').mostBlogs
const blogs = require('./dummyData')

describe('mostBlogs func', () => {
  test('by inserting a null parameter value it should return null', () => {
    expect(mostBlogs(null)).toBe(null)
  })

  test('by inserting an empty array value it should return null', () => {
    expect(mostBlogs([])).toBe(null)
  })

  test('testing with bunch of blogs to return with the most of blogs', () => {
    const result = { author: 'Robert C. Martin', blogs: 3 }
    expect(mostBlogs(blogs)).toEqual(result)
  })
})