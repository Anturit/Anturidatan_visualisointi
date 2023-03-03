import axios from 'axios'
const baseUrl = '/api/users'

let token = null

/**
 * @typedef {Object} userObject - object with all fields except passwordHash:
 * @property {string} username
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} address
 * @property {string} postalCode
 * @property {string} city
 * @property {string} role
 * @property {Date} expirationDate
 * @property {string[]} senderDeviceIds
*
*/

const setToken = newToken => {
  token = `Bearer ${newToken.toString()}`
}

/**
 * Create new user
 * @param {Object} newObject user object containing all fields in the
 *                           register form and list of users device ids
 * @returns {userObject} user object without password field
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
 * @returns {userObject} userObject
*/
const getUser = async (user_id) => {
  const config = { headers: { Authorization: token }, }
  const response = await axios.get(`${baseUrl}/${user_id}`, config)
  return response.data
}

/**
 * // Fetch all user objects.
 * @returns {Array.<userObject>} array of user objects
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
 * @returns {Object.<string, string>} contains message about successful/failed deletion
*/
const deleteUser = async (user_id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${user_id}`, config)
  return response.data
}

/**
 * @param {string} user_id
 * @param {string} oldPassword
 * @param {string} newPassword
 * @param {string} confirmNewPassword
 * @returns {Object.<string, string>} contains message about successful/failed password change
*/
const changePassword = async (user_id, oldPassword, newPassword, confirmNewPassword) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(`${baseUrl}/${user_id}/password_change`, {
    oldPassword: oldPassword,
    newPassword: newPassword,
    confirmNewPassword: confirmNewPassword
  }, config)
  return response.data
}

export default { create, setToken, getUser, getAllUsers, deleteUser, changePassword }