import { useState } from 'react'
import { setUser } from '../reducers/loginFormReducer'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import userService from '../services/userService'
import Notification from './Notification'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
//import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Logo from '../assets/logo_b.png'
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
    <>

      <Container>
        <Box
          sx={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ maxWidth: 608 }}>
            <img src={Logo} style={{ width: '100%' }} alt="Kymppiremontit logo" />
          </div>
          <Notification />
        </Box>
      </Container>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Sähköposti"
              id='username'
              name='username'
              data-cy='username'
              onChange={({ target }) => setUsername(target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Salasana"
              type="password"
              name="password"
              id='password'
              data-cy='password'
              onChange={({ target }) => setPassword(target.value)}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              color="primary"
              data-cy="login"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Kirjaudu sisään
            </Button >
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default LoginForm