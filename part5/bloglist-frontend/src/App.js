import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [isErrorMessage, setIsErrorMessage] = useState(false)
  const [isAddVisible, setAddVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const displayMessage = (messageToDisplay, isError=false) => {
    setIsErrorMessage(isError)
    setMessage(messageToDisplay)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
  }

  const addBlog = async (blogObject) => {
    setAddVisible(false)
    try {
      const returnedBlog = await blogService.add(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      displayMessage(`Added a new blog ${returnedBlog.title} by ${returnedBlog.author}`)
    } catch (exception) {
      displayMessage('Could not add blog', true)
    }
  }

  const likeBlog = async (blogObject) => {
    blogObject.likes += 1
    await blogService.update(blogObject)
    getBlogs()
  }

  const deleteBlog = async (blogObject) => {
    if (window.confirm(`Delete blog '${blogObject.title}' by ${blogObject.author}?`)) {
      await blogService.remove(blogObject)
      getBlogs()
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      displayMessage('Incorrect username or password', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)

    displayMessage('Successfully logged out')
  }

  const loginForm = () => (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
    </div>
  )

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      <Togglable
        buttonLabel="Add blog"
        visible={isAddVisible}
        setVisible={setAddVisible}
      >
        <BlogForm uploadBlog={addBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={likeBlog} currentUser={user} handleDelete={deleteBlog} />
      )}
    </div>
  )

  return (
    <div>
      <h1>Bloglist</h1>
      <Notification message={message}
        error={isErrorMessage}
      />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Log out</button>
          {blogList()}
        </div>
      }
    </div>
  )
}

export default App