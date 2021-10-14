const { insertMany } = require("../models/blog")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0 
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (highest, item) => {
    return highest.likes >= item.likes 
      ? highest
      : item
  }

  const favorite = blogs.reduce(reducer, 0)
  return favorite === 0 
    ? null
    : favorite
}

const mostBlogs = (blogs) => {
  const reducer = (authors, item) => {
    const authorIndex = authors.findIndex(blog => blog.author === item.author)

    if (authorIndex !== -1) {
      authors[authorIndex].blogs++
      return authors
    } else {
      return authors.concat({ author: item.author, blogs: 1 })
    }
  }

  const authors = blogs.reduce(reducer, [])
  return authors.length === 0 
    ? null
    : authors.reduce((prev, current) => (prev.blogs >= current.blogs) ? prev : current)
}

const mostLikes = (blogs) => {
  const reducer = (authors, item) => {
    const authorIndex = authors.findIndex(blog => blog.author === item.author)

    if (authorIndex !== -1) {
      authors[authorIndex].likes += item.likes
      return authors
    } else {
      return authors.concat({ author: item.author, likes: item.likes })
    }
  }

  const authors = blogs.reduce(reducer, [])
  return authors.length === 0 
    ? null
    : authors.reduce((prev, current) => (prev.likes >= current.likes) ? prev : current)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}