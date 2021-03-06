import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const add = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async blogObject => {
  const blogUrl = `${baseUrl}/${blogObject.id}`
  const response = await axios.put(blogUrl, blogObject)
  return response
}

const remove = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }
  const blogUrl = `${baseUrl}/${blogObject.id}`
  const response = await axios.delete(blogUrl, config)
  return response
}

const exportedObject = { getAll, add, setToken, update, remove }
export default exportedObject