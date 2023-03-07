import axios from 'axios'
const baseUrl = '/api/senders'

/**
 * Function that fetches all senders from the server
 * @param {string} token - Authorization token
 * @returns {Array.<Object>} - Array of sender objects
 */
const getAll = async (token) => {
  const config = { headers: { Authorization: `bearer ${token}` }, }
  const response = await axios.get(baseUrl, config)
  return response.data
}

/**
 * Function that fetches one sender from the server
 * @param {string} id - Sender id
 * @param {string} token - Authorization token
 * @returns {Object} - Sender object
*/
const getOneSenderLogs = async (id, token) => {
  const config = { headers: { Authorization: `bearer ${token}` }, }
  const response = await axios.get(`${ baseUrl }/${id}`, config)
  return response.data
}

const senderService = {
  getAll,
  getOneSenderLogs,
}

export default senderService