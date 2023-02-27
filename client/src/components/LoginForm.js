import { useState } from 'react'
import axios from 'axios'
import userService from '../services/userService'
import store from '../store'
import { setUser } from '../reducers/loginFormReducer'
import { setNotification } from '../reducers/notificationReducer'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = async credentials => {
    /**
    *@returns user object with all fields except passwordHash:
    *{* @param {Object} user
     * @param {string} user.username
     * @param {string} user.firstName
     * @param {string} user.lastname
     * @param {string} user.address
     * @param {string} user.postalCode
     * @param {string} user.city
     * @param {string} user.role
     * @param {Date} user.expirationDate
    *  @param {list} user.senderDeviceIds
    *}
    */
    const res = await axios.post(
      '/api/login/', credentials
    )
    return res.data
  }
  const handleLogin = async (loginEvent) => {
    /**
    * Function to fetch user for session and storing it to localstorage
   */
    loginEvent.preventDefault()
    try {
      const user = await login(
        { username, password }
      )
      console.log(`logging in with ${JSON.stringify(user)}`)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      store.dispatch(setUser(user))
      userService.setToken(user.token)
      store.dispatch( setNotification(
        `${user.firstName} ${user.lastName} kirjattu sisään`, 3500
      ))
      setUsername('')
      setPassword('')
    } catch (err) {
      console.log(err)
      if (err.response.data.error) {
        if (err.response.data.error.includes('expired')) {
          store.dispatch(setNotification(
            'Käyttäjän lisenssi vanhentunut', 3500, 'alert'
          ))
        } else {
          store.dispatch(setNotification(
            'Väärä käyttäjänimi tai salasana', 3500, 'alert'
          ))
        }
      } else {
        store.dispatch(setNotification(
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