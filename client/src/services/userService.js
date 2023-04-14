import axios from 'axios'
import { setUser } from '../reducers/loginFormReducer'
const baseUrl = '/api/users'
let config = null

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

/**
 * Set new config
 * @param {string} token - Authentication token
 */
const setToken = (token) => {
  config = {
    headers: { Authorization: `bearer ${token}` }
  }
}

const removeToken = () => config = null

/**
 * Essentially logouts user by removing user information from browser and website memory.
 *
 * @param {any|function} redux store's `dispatch` function
 */

const logoutLocalUser = (dispatch) => {
  dispatch(setUser(null))
  window.localStorage.setItem('loggedUser', '')
}

/**
 * Create new user
 * @param {Object} newObject user object containing all fields in the
 *                           register form and list of users device ids
 * @returns {userObject} user object without password field
*/
const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

/**
 * Fetch individual user object based on user_id
 * @param {string} user_id
 * @returns {userObject} userObject
*/
const getUser = async (user_id) => {
  const response = await axios.get(`${baseUrl}/${user_id}`, config)
  return response.data
}

/**
 * // Fetch all user objects.
 * @returns {Array.<userObject>} array of user objects
 */
const getAllUsers = async () => {
  console.log('config, getAllusers servicessä', config)
  const response = await axios.get(`${baseUrl}/`, config)
  return response.data
}

/**
 * @param {string} user_id
 * @returns {Object.<string, string>} contains message about successful/failed deletion
*/
const deleteUser = async (user_id) => {
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
  const response = await axios.post(`${baseUrl}/${user_id}/password_change`, {
    oldPassword: oldPassword,
    newPassword: newPassword,
    confirmNewPassword: confirmNewPassword
  }, config)
  return response.data
}

/**
   * Update user details
   * @param {string} user_id
   * @param {object} newObject
   * @returns {object} user object
*/

const updateUserDetails = async (user_id, newObject) => {
  const response = await axios.put(`${baseUrl}/${user_id}`, newObject, config)
  return response.data
}


/**
 * Remove sender device id from user's list of sender devices
 * @param {string} user_id
 * @param {string} senderDeviceId
 * @returns {userObject} user object
*/

const removeSenderDevice = async (user_id, senderDeviceId) => {
  const response = await axios.put(`${baseUrl}/${user_id}/deleteSenderDevice`, { senderDeviceId: senderDeviceId }, config)
  console.log(response, 'hello')

}

/**
 * Add sender device id to user's list of sender devices
 * @param {string} userId
 * @param {string} senderDeviceId
 * @returns {userObject} user object
*/

const addSenderDevice = async (userId, senderDeviceId) => {
  const response = await axios.put(`${baseUrl}/${userId}/addSenderDevice`, { senderDeviceId }, config)
  return response.data
}

const updateUserExpirationDate = async (user_id, newExpirationDate) => {
  const response = await axios.put(`${baseUrl}/${user_id}/changeExpirationDate`, { newExpirationDate }, config)
  return response.data
}


export default {
  create,
  setToken,
  getUser,
  getAllUsers,
  deleteUser,
  changePassword,
  logoutLocalUser,
  updateUserDetails,
  removeToken,
  removeSenderDevice,
  addSenderDevice,
  updateUserExpirationDate
}
