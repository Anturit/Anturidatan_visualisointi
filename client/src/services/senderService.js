import axios from 'axios'
const baseUrl = '/api/senders'

const getAll = async (token) => {
  /**
   * Function that fetches all senders from the server
   * @param {string} token - Authorization token
   * @returns {array} - Array of sender objects
   */

  const config = { headers: { Authorization: `bearer ${token}` }, }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const getOneSenderLogs = async (id, token) => {
  /**
   * Function that fetches one sender from the server
   * @param {string} id - Sender id
   * @param {string} token - Authorization token
   * @returns {object} - Sender object
  */

  const config = { headers: { Authorization: `bearer ${token}` }, }
  const response = await axios.get(`${ baseUrl }/${id}`, config)
  return response.data
}

const senderService = {
  getAll,
  getOneSenderLogs,
}

export default senderService