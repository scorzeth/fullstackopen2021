import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  let mockHandleLike

  beforeEach(() => {
    const blog = {
      title: 'Test blog title',
      author: 'Test Author',
      url: 'http://testblog.net/test-post',
      likes: 1,
      user: {
        name: 'Test Creator',
        username: 'testcreator'
      }
    }
    const user = JSON.parse('{"name":"Test User", "username":"testuser"}')
    mockHandleLike = jest.fn()
    const mockHandleDelete = jest.fn()

    component = render(
      <Blog blog={blog} handleLike={mockHandleLike} currentUser={user} handleDelete={mockHandleDelete} />
    )
  })

  test('renders title and author, but does not render url or likes', () => {
    expect(component.container).toHaveTextContent('Test blog title')
    expect(component.container).toHaveTextContent('Test Author')

    const div = component.container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('url and likes are shown when view button is clicked', () => {
    const button = component.getByText('View')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('like button can be clicked multiple times', () => {
    const button = component.getByText('Like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandleLike.mock.calls).toHaveLength(2)
  })
})