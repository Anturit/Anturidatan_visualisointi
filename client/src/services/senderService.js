import axios from 'axios'
const baseUrl = '/api/senders'
let config = null

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
 * Function that fetches all senders from the server
 * @param {string} token - Authorization token
 * @returns {Array.<Object>} - Array of sender objects
 */
const getAll = async () => {
  const response = await axios.get(baseUrl, config)
  return response.data
}

/**
 * Function that fetches one sender from the server
 * @param {string} id - Sender id
 * @param {string} token - Authorization token
 * @returns {Object} - Sender object
*/
const getOneSenderLogs = async (id) => {
  const response = await axios.get(`${ baseUrl }/${id}`, config)
  return response.data
}

const getOneSenderLogsFromYear = async (id, year) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/${year}`, config)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('No data during this time period')
      return []
    } else {
      console.error('Error fetching data:', error)
    }
  }
}

export default {
  getAll,
  getOneSenderLogs,
  getOneSenderLogsFromYear,
  removeToken,
  setToken
}