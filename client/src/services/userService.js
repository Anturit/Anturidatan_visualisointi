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

const getUser = async (user_id) => {
  /**
   * Fetch individual user object based on user_id
   * @param user_id
   * @returns user object
   */
  const config = { headers: { Authorization: token }, }
  const response = await axios.get(`${baseUrl}/${user_id}`, config)
  return response.data
}
/**
 * // Fetch all user objects.
 * @returns array of user objects
 */
const getAllUsers = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(`${baseUrl}/`, config)
  return response.data
}

const deleteUser = async (user_id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${user_id}`, config)
  return response
}

export default { create, setToken, getUser, getAllUsers, deleteUser }