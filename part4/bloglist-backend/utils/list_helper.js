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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}