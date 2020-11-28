const mostLikes = require('../utils/list_helper').mostLikes
const blogs = require('./dummyData')

describe('mostLikes func', () => {
  test('by inserting a null parameter value it should return null', () => {
    expect(mostLikes(null)).toBe(null)
  })

  test('by inserting an empty array value it should return null', () => {
    expect(mostLikes([])).toBe(null)
  })

  test('testing with bunch of blogs to return with the most of blogs', () => {
    const result = { author: 'Edsger W. Dijkstra', likes: 17 }
    expect(mostLikes(blogs)).toEqual(result)
  })
})