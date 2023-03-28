import { useState } from 'react'
import { setUser } from '../reducers/loginFormReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import userService from '../services/userService'

/**
 * @typedef {import('../services/userService').userObject} userObject
 */

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  /**
   * @param {{username: string, password: string}} credentials
   * @returns {userObject}
   */
  const login = async credentials => {

    const res = await axios.post(
      '/api/login/', credentials
    )
    return res.data
  }

  /**
  * Function to fetch user for session and storing it to localstorage
  * @param {onSubmit} loginEvent - The observable event.
  * @listens onSubmit
  */
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
      dispatch(setUser(user))
      userService.setToken(user.token)
      dispatch(setNotification(
        `${user.firstName} ${user.lastName} kirjattu sisään`, 3500
      ))
      setUsername('')
      setPassword('')
      if (user.role === 'admin') {
        navigate('/users')
      } else {
        navigate('/user')
      }
    } catch (err) {
      console.log(err)
      if (err.response.data.error) {
        if (err.response.data.error.includes('expired')) {
          dispatch(setNotification(
            'Käyttäjän lisenssi vanhentunut', 3500, 'alert'
          ))
        } else {
          dispatch(setNotification(
            'Väärä käyttäjänimi tai salasana', 3500, 'alert'
          ))
        }
      } else {
        dispatch(setNotification(
          `Palvelin ei vastaa. Status ${err.response.status}`, 3500, 'alert'
        ))
      }
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        käyttäjänimi
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
        salasana
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
        <button type="submit" data-cy="login">Kirjaudu sisään</button>
      </div>
    </form>
  )
}

export default LoginForm