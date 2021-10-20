const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
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
  const newBlog = {
    title: 'The Death and Birth of Technological Revolutions',
    author: 'Ben Thompson',
    url: 'https://stratechery.com/2021/the-death-and-birth-of-technological-revolutions/',
    likes: 1
  }
  
  await api
    .post('/api/blogs')
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
  const newBlog = {
    title: 'The Death and Birth of Technological Revolutions',
    author: 'Ben Thompson',
    url: 'https://stratechery.com/2021/the-death-and-birth-of-technological-revolutions/'
  }
  
  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(savedBlog.body.likes).toEqual(0)
})

test('adding a blog without title and url responds with 400', async () => {
  const newBlog = {
    author: 'Ben Thompson'
  }

  const savedBlog = await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
})

test('delete a blog post', async () => {
  const blogsAtStart = await helper.blogsInDB()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDB()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).not.toContain(blogToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})