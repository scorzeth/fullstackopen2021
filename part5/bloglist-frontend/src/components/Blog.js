import React, { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
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
      <div style={showWhenVisible}>
        {blog.url}<br />
        Likes {blog.likes} <button onClick={() => handleLike(blog)}>Like</button> <br />
        {blog.user.name}<br />
      </div>
    </div>  
)}

export default Blog