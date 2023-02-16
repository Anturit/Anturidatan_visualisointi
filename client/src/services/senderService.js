import axios from 'axios'
const baseUrl = '/api/senders'

const getAll = async (token) => {
  console.log(token)
  const config = { headers: { Authorization: `bearer ${token}` }, }
  const response = await axios.get(baseUrl, config)
  return response.data
}

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