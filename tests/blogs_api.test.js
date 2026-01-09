const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let tokenGot = ''

beforeEach(async () => {
    if (mongoose.connection.readyState === 0) {
        console.log('Mongoose not connected, check your URI and network');
    }

    await User.deleteMany({})
    await Blog.deleteMany({})

    //1. Creating user
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name:'testMeet', passwordHash })
    const savedUser = await user.save()

    //2 Getting token
    const res = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    console.log(res.body)
    tokenGot = res.body.token

    //3. linking initialblogs to this user
    const blogObjs = helper.initialBlogs.map(blog => ({
        ...blog,
        user: savedUser._id
    }))
    // console.log('cleared')
    await Blog.insertMany(blogObjs)
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
        .set('Authorization', `Bearer ${tokenGot}`)
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
        .set('Authorization', `Bearer ${tokenGot}`)
        .send(newBlogpost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(b => b.title === 'third one test post w/o likes')
    assert.strictEqual(addedBlog.likes, 0)
})

test('verify that if the title or url properties are missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    
    const newBlogpost = {
        // title: 'meetu',
        author: 'Chintu',
        url: 'www.ad.com'
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${tokenGot}`)
        .send(newBlogpost)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length)
})

test('deletion of a note, should return 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    // console.log(blogsAtStart)
    const blogToDelete = blogsAtStart.find(b => b.title === 'Second BlogList')

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${tokenGot}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    // console.log(blogsAtEnd)

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(!contents.includes('Second BlogList'))
})

test('updatig the likes property', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blog2update = blogsAtStart.find(b => b.title === 'Second BlogList')
    // console.log(blog2update)

    const updatedBlogpost = {
        title: blog2update.title,
        author: blog2update.author,
        url: blog2update.url,
        likes: 2026
    }

    await api
        .put(`/api/blogs/${blog2update.id}`)
        .send(updatedBlogpost)
        .expect(200)
    
    const blogsAtEnd = await helper.blogsInDb()
    // console.log(blogsAtEnd)
    const updatedBlogInDb = blogsAtEnd.find(b => b.id === blog2update.id)
    assert.strictEqual(updatedBlogInDb.likes, updatedBlogpost.likes)
})

describe('when there is initially only one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creating fresh user with fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        // console.log(result)
        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

describe('checking validation of usernaem, password', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('Missing password', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        // console.log(result)
        assert(result.body.error.includes('password is required'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('Password < 3 chars', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: '12'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        // console.log(result)
        assert(result.body.error.includes('password must be at least 3 characters long'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('Username < 3 chars', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ro',
            name: 'Superuser',
            password: 'abc336'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        console.log(result.body)
        assert(result.body.error.includes('minimum allowed length (3)'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })    
})

test('adding a blog fails with 401 Unauthorized if token is not provided', async () => {
    const newBlogpost = {
        title: 'Unauthorized blog',
        author: 'Hackerman',
        url: 'www.hack.com',
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlogpost)
        .expect(401) // Expecting failure because no token is set

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})