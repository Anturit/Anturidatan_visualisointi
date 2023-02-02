import axios from 'axios'
const baseUrl = '/api/senders'

const getAll = async (token) => {
  const config = { headers: { Authorization: `bearer ${token}` }, }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const senderService = {
  getAll,
}

export default senderService