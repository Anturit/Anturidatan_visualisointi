import axios from 'axios'
const baseUrl = '/api/users'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken.toString()}`
}

/**
 * Create new user
 * @param {Object} newObject user object containing all fields in the
 *                           register form and list of users device ids
 * @returns {Object} user object without password field
*/
const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

/**
 * Fetch individual user object based on user_id
 * @param {string} user_id
 * @returns {Object} user object
*/
const getUser = async (user_id) => {
  const config = { headers: { Authorization: token }, }
  const response = await axios.get(`${baseUrl}/${user_id}`, config)
  return response.data
}

/**
 * // Fetch all user objects.
 * @returns {Object[]} array of user objects
 */
const getAllUsers = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(`${baseUrl}/`, config)
  return response.data
}

/**
 * @param {string} user_id
 * @returns {Object} contains message about successful/failed deletion
*/
const deleteUser = async (user_id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${user_id}`, config)
  return response.data
}

/**
   * Update user details
   * @param {string} user_id
   * @param {object} newObject
   * @returns {object} user object
*/

const updateUserDetails = async (user_id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${user_id}`, newObject, config)
  return response.data
}

export default { create, setToken, getUser, getAllUsers, deleteUser, updateUserDetails }