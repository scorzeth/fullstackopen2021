import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, currentUser, handleDelete }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={toggleVisibility}>View</button>
        <button style={showWhenVisible} onClick={toggleVisibility}>Hide</button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        {blog.url}<br />
        Likes {blog.likes} <button onClick={() => handleLike(blog)}>Like</button> <br />
        {blog.user.name}<br />
        { blog.user.username === currentUser.username ?
          <button onClick={() => handleDelete(blog)}>Delete</button> : null
        }
      </div>
    </div>
  )
}

Blog.propTypes = {
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  blog: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
}

export default Blog