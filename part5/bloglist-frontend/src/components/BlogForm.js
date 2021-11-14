import React, { useState } from "react"
import PropTypes from 'prop-types'

const BlogForm = ({ uploadBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    uploadBlog({
      title: title,
      author: author,
      url: url
    })
    
    setTitle('')
    setAuthor('')
    setURL('')
  }
  
  return (
    <div>
      <h3>Add blog</h3>
      <form onSubmit={addBlog}>
        <div>
          Title
          <input 
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author
          <input 
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL
          <input 
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setURL(target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>   
    </div> 
  )
}

BlogForm.propTypes = {
  uploadBlog: PropTypes.func.isRequired
}

export default BlogForm