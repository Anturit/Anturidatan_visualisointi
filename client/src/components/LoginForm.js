import { useState } from 'react'
import axios from 'axios'
import userService from '../services/registerService'

const LoginForm = ({ setUser, setNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  /*
    username
    password
    */
  const login = async credentials => {
    const res = await axios.post(
      '/api/login/', credentials
    )
    return res.data
  }
  const handleLogin = async (loginEvent) => {
    loginEvent.preventDefault()
    try {
      const user = await login(
        { username, password }
      )
      console.log(`logging in with ${JSON.stringify(user)}`)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setUser(user)
      userService.setToken(user.token)
      setNotification({ message: `${user.firstName} ${user.lastName} logged in` })
      setTimeout(() => {
        setNotification(null)
      }, 3500)
      setUsername('')
      setPassword('')
    } catch (err) {
      setNotification({ message: 'Wrong username or password', type: 'alert' })
      setTimeout(() => {
        setNotification(null)
      }, 3500)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
                username
        <input
          type={'text'}
          value={username}
          id='username'
          name='username'
          data-cy='username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
                password
        <input
          type={'password'}
          value={password}
          id='password'
          name='password'
          data-cy='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <button type="submit" data-cy="login">Login</button>
      </div>
    </form>
  )
}

export default LoginForm