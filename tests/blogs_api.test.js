const { test, after, beforeEach, afterEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')

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

test.only('unique id of blog posts is id, by default db names _id', async () => {
    const response = await api.get('/api/blogs')

    // console.log(Object.keys(response.body[0]))
    // assert.strictEqual(!!response.body[0].id, true)
    assert.ok('id' in response.body[0])
    assert.ok(!('_id' in response.body[0]))
    assert.ok(!('__v' in response.body[0]))
})

after(async () => {
    await mongoose.connection.close()
})