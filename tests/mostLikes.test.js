const { test, describe } = require('node:test')
const assert = require('node:assert')

const mostLikes = require('../utils/list_helper').mostLikes

const blogsTest1 = []
const blogsTest2 = [{
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 5,
    __v: 0
  }]
const blogslist3 = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]
const blogsTied = [
  {
    _id: "1",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "2",
    title: "Second blog by Michael",
    author: "Michael Chan",
    url: "https://example.com/2",
    likes: 5,
    __v: 0
  },
  {
    _id: "3",
    title: "Third blog by Michael",
    author: "Michael Chan",
    url: "https://example.com/3",
    likes: 12,
    __v: 0
  },
  {
    _id: "4",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "6",
    title: "Another Dijkstra blog",
    author: "Edsger W. Dijkstra",
    url: "http://example.com/6",
    likes: 8,
    __v: 0
  },
  {
    _id: "7",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
    __v: 0
  },
  {
    _id: "8",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  }
]

describe('most likes', () => {
    test('of empty list is zero', () => {
        assert.deepStrictEqual(mostLikes(blogsTest1), {})
    })

    test('when list had only one blog equals the likes of that', () => {
        assert.deepStrictEqual(mostLikes(blogsTest2), { author: 'Michael Chan', likes: 5 })
    })

    test('of a bigger list is calculated right', () => {
        assert.deepStrictEqual(mostLikes(blogslist3), { author: 'Edsger W. Dijkstra', likes: 17 })
    })

    test('of a bigger list tied is calculated right', () => {
        assert.deepStrictEqual(mostLikes(blogsTied), { author: "Edsger W. Dijkstra", likes: 25 })
    })
})