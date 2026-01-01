const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  return res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  if (!req.body.title || !req.body.url) {
    // console.log(res)
    return res.status(400).end()
  }
  
  const blog = new Blog(req.body)

  const result = await blog.save()
  res.status(201).json(result)
})

module.exports = blogsRouter