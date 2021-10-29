import React, { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

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

  const likeBlog = () => {
    handleLike(blog)
    setLikes(likes + 1)
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
        Likes {likes} <button onClick={likeBlog}>Like</button> <br />
        {blog.user.name}<br />
      </div>
    </div>  
)}

export default Blog