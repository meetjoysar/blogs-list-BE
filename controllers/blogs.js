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
  return res.status(201).json(result)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  return res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing'})
  }

  const blog2update = {
    title,
    author,
    url,
    likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog2update, { new: true, runValidators: true, context: 'query' })

  if (!updatedBlog) {
    res.status(404).end()
  } else {
    res.json(updatedBlog)
  }
})

module.exports = blogsRouter