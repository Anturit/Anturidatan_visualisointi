import axios from 'axios'
const baseUrl = '/api/users'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken.toString()}`
}

const create = async newObject => {
  /**
   * Create new user
   * @param {object} newObject user object containing all fields in the
   *                           register form and list of users device ids
   * @returns {object} user object without password field
   */
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
  /**
   * @param {string} user_id
   * @returns {object} contains message about successful/failed deletion
   */
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${user_id}`, config)
  return response.data
}

export default { create, setToken, getUser, getAllUsers, deleteUser }