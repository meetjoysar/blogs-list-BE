const { test, after, beforeEach, afterEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { title } = require('node:process')
const { url } = require('node:inspector')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    // console.log('cleared')

    await Blog.insertMany(helper.initialBlogs)
})

test('all blog posts are returned in JSON format', async () => {
    // console.log('entered test')
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blog posts are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique id of blog posts is id, by default db names _id', async () => {
    const response = await api.get('/api/blogs')

    // console.log(Object.keys(response.body[0]))
    // assert.strictEqual(!!response.body[0].id, true)
    assert.ok('id' in response.body[0])
    assert.ok(!('_id' in response.body[0]))
    assert.ok(!('__v' in response.body[0]))
})

test('a valid blogpost can be added', async () => {
    const newBlogpost = {
        title: 'third one test post',
        author: 'Chaava',
        url: 'www.raaje.com',
        likes: 1630
    }

    await api
        .post('/api/blogs')
        .send(newBlogpost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const contents = blogsAtEnd.map(n => n.title)

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert(contents.includes('third one test post'))
})

test('verifies, if likes is missing from req, it will default to value 0', async () => {
    const newBlogpost = {
        title: 'third one test post w/o likes',
        author: 'Chintu',
        url: 'www.chintu.com',
    }

    await api
        .post('/api/blogs')
        .send(newBlogpost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(b => b.title === 'third one test post w/o likes')
    assert.strictEqual(addedBlog.likes, 0)
})

test.only('verify that if the title or url properties are missing', async () => {
    const newBlogpost = {
        // title: 'meetu',
        author: 'Chintu',
        url: 'www.ad.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlogpost)
        .expect(400)
})

after(async () => {
    await mongoose.connection.close()
})