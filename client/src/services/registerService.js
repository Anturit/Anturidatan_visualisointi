import axios from 'axios'
const baseUrl = '/api/users'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken.toString()}`
  console.log(
    console.log(`tokeni: ${token}`))
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
export default { create, setToken }