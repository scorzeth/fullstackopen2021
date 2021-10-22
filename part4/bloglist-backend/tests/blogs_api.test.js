const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

describe('blog api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })
  
    await user.save()
    
    await Blog.deleteMany({})
    
    const blogObjects = helper.initialBlogs.map(blog => Object.assign(blog, {user: user._id.toString()})).map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

  })

  test('all blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier of blogs is named id', async () => {
    const response = await api.get('/api/blogs')

    const ids = response.body.map(r => r.id)

    expect(ids[0]).toBeDefined()
  })

  test('a blog can be added', async () => {
    const user = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'secret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const newBlog = {
      title: 'The Death and Birth of Technological Revolutions',
      author: 'Ben Thompson',
      url: 'https://stratechery.com/2021/the-death-and-birth-of-technological-revolutions/',
      likes: 1
    }
    
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
      'The Death and Birth of Technological Revolutions'
    )
  })

  test('adding a blog with no likes property defaults to 0', async () => {
    const user = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'secret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      title: 'The Death and Birth of Technological Revolutions',
      author: 'Ben Thompson',
      url: 'https://stratechery.com/2021/the-death-and-birth-of-technological-revolutions/'
    }
    
    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(savedBlog.body.likes).toEqual(0)
  })

  test('adding a blog without title and url responds with 400', async () => {
    const user = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'secret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const newBlog = {
      author: 'Ben Thompson'
    }

    const result = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${user.body.token}`)
      .send(newBlog)
      .expect(400)

    expect(result.body.error).toContain('`title` is required')
    expect(result.body.error).toContain('`url` is required')
  })

  test('adding a blog without a token fails with 401', async () => {
    const newBlog = {
      title: 'The Death and Birth of Technological Revolutions',
      author: 'Ben Thompson',
      url: 'https://stratechery.com/2021/the-death-and-birth-of-technological-revolutions/',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('delete a blog post', async () => {
    const user = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'secret'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtStart = await helper.blogsInDB()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${user.body.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('update likes for a blog post', async () => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes += 1

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(updatedBlog.body.likes).toEqual(blogToUpdate.likes)
  })
})
describe('user api tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })
  
    await user.save()
  })
  
  test('can create new user', async () => {
    const usersAtStart = await helper.usersInDB()
  
    const newUser = {
      username: 'coolcat',
      name: 'Cool Cat',
      password: 'catsarec00l'
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  
  test('creation fails if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDB()
    
    const newUser = {
      username: 'co',
      name: 'Cool Cat',
      password: 'catsarec00l'
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body.error).toContain('is shorter than the minimum allowed length')
    
    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
  test('creation fails if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDB()
  
    const newUser = {
      username: 'coolcat',
      name: 'Cool Cat',
      password: 'ct'
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body.error).toContain('is shorter than the minimum allowed length')
    
    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
  test('creation fails if username is already taken', async () => {
    const usersAtStart = await helper.usersInDB()
  
    const newUser = {
      username: 'root',
      name: 'Groot',
      password: 'iamgroot'
    }
  
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    expect(result.body.error).toContain('`username` to be unique')
    
    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})