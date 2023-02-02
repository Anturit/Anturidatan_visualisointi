import axios from 'axios'
const baseUrl = '/api/users'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken.toString()}`
  console.log('tokeni:')
  console.log(token)
}

const create = async newObject => {
  console.log(`createssa tokeni: ${token.toString()}`)
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}
export default { create, setToken }