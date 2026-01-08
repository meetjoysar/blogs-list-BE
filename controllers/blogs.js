const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const req_body = req.body

  const user_in_db = await User.findById(req_body.userId)

  if (!user_in_db) {
    return res.status(400).json({ error: 'userId missing or not valid' })
  } else if (!req_body.title || !req_body.url) {
    // console.log(res)
    return res.status(400).json({ error: 'title and/or body missing' })
  }
  
  const blogpost = new Blog({
    url: req_body.url,
    title: req_body.title,
    author: req_body.author,
    user: user_in_db._id,
    likes: req_body.likes
  })

  const savedBlog = await blogpost.save()
  user_in_db.blogposts = user_in_db.blogposts.concat(savedBlog._id)
  await user_in_db.save()

  return res.status(201).json(savedBlog)
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