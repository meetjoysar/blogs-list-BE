const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'First BlogList',
        author: 'Meet Joy',
        url: 'www.meetjoy.com',
        likes: 295
    },
    {
        title: 'Second BlogList',
        author: 'Ana de amras',
        url: 'www.ajaajadilli.com',
        likes: 69
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = { initialBlogs, blogsInDb }