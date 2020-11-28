const totalLikes = require('../utils/list_helper').totalLikes
const listOfBlogs = require('./dummyData')

describe('total likes', () => {

  /*const listOfBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Greeting',
      author: 'Bart Simpson',
      url: 'http.//bartsimpson.com',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b89a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 8,
      __v: 0
    },
    {
      _id: '5a422aa71b54a671235d17f8',
      title: 'Paycheck',
      author: 'George Bush',
      url: 'http://paymesomemoney.com',
      likes: 12,
      __v: 0
    }
  ]*/

  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    expect(totalLikes(listOfBlogs.slice(0,1))).toBe(7)
  })

  test('of a bigger list is calculated riht', () => {
    expect(totalLikes(listOfBlogs)).toBe(36)
  })
})