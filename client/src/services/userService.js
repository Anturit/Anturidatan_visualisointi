import axios from 'axios'
const baseUrl = '/api/users'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken.toString()}`
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const getUserDetails = async (user_id, token) => {
  const config = { headers: { Authorization: `bearer ${token}` }, }
  const response = await axios.get(`${ baseUrl }/${user_id}`, config)
  return response.data
}

export default { create, setToken, getUserDetails }