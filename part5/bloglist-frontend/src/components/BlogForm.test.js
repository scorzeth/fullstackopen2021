import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> creates a blog with the correct input and calls onSubmit', () => {
  const uploadBlog = jest.fn()

  const component = render(
    <BlogForm uploadBlog={uploadBlog} />
  )

  // Title, Author, URL
  const title = component.container.querySelector('input[name="Title"]')
  const author = component.container.querySelector('input[name="Author"]')
  const url = component.container.querySelector('input[name="URL"]')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'Test blog title' }
  })
  fireEvent.change(author, {
    target: { value: 'Test Author' }
  })
  fireEvent.change(url, {
    target: { value: 'http://testblog.net/test-post' }
  })
  fireEvent.submit(form)

  expect(uploadBlog.mock.calls).toHaveLength(1)
  expect(uploadBlog.mock.calls[0][0]['title']).toBe('Test blog title')
  expect(uploadBlog.mock.calls[0][0]['author']).toBe('Test Author')
  expect(uploadBlog.mock.calls[0][0]['url']).toBe('http://testblog.net/test-post')
})