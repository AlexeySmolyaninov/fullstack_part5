const favoriteBlog = require('../utils/list_helper').favoriteBlog
const blogs = require('./dummyData')

describe('favorite blog', () => {
  test('empty array of blogs should return null', () => {
    expect(favoriteBlog([])).toBe(null)
  })

  test('null passed as array of blogs parameter should return null', () => {
    expect(favoriteBlog(null)).toBe(null)
  })

  test('from a banch of blogs one which favorite one should be returned', () => {
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }
    expect(favoriteBlog(blogs)).toEqual(expected)
  })
})