import axios from 'axios'

import { getToken } from '../utils/localstorage'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async (blog) => {
  const config = {
    headers: {
      Authorization: getToken()
    }
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: {
      Authorization: getToken()
    }
  }
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response.status
}

const updateBlog = async (blog) => {
  const config = {
    headers: {
      Authorization: getToken()
    }
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config)
  return response.data
}

export default { getAll, createBlog, deleteBlog, updateBlog }