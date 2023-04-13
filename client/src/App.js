import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/loginFormReducer'
import {
  useLocation,
  useNavigate,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import UserProfile from './components/UserProfile'
import RegisterForm from './components/RegisterForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import userService from './services/userService'
import jwt_decode from 'jwt-decode'
import UserMainView from './components/UserMainView'
import Navbar from './components/Navbar'
import Button from '@mui/material/Button'
import { ThemeProvider, createTheme } from '@mui/material/styles'

function App() {
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()
  const isJsonWebTokenExpired = jwt => {
    const decodedToken = jwt_decode(jwt)
    const expiresAtMillis = decodedToken.exp * 1000
    return expiresAtMillis < Date.now()
  }

  const navigate = useNavigate()
  const location = useLocation()

  /**
  * Fetch user from window.localStorage.
  * If jwt token valid:
  *   Save user.token to userService and user to redux state.
  *   Change Url according to user role
  */

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (!loggedUserJSON) return

    const parsedUser = JSON.parse(loggedUserJSON)
    if (isJsonWebTokenExpired(parsedUser.token)) return
    dispatch(setUser(parsedUser))
    userService.setToken(parsedUser.token)

    if (parsedUser.role === 'admin') {
      if (['/users', '/register', '/userprofile'].includes(location.pathname)) return
      navigate('/')
    } else {
      if (['/user', '/userprofile'].includes(location.pathname)) return
      navigate('/user')
    }

  }, [])
  const theme = createTheme({
    palette: {
      primary: {
        main: '#e60d2e'
      },
      secondary: {
        main: '#75787b'
      }
    }
  })

  return (
    <div>
      {user
        ?
        <><ThemeProvider theme={theme}>
          <Navbar />
          <Button  color="secondary" variant="contained" onClick={() => userService.logoutLocalUser(dispatch)}
            data-cy='logout'>Kirjaudu ulos käyttäjältä {user.firstName} {user.lastName}</Button>
          <Notification />
          <Routes>
            <Route path="/user" element={<UserMainView />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={user.role === 'admin'
              ? <Navigate replace to="/users" />
              : <Navigate replace to="/user" />}/>
          </Routes>
        </ThemeProvider>
        </>
        : <LoginForm />
      }
      <div>
        <br />
        <em>Anturi app, demo 2023</em>
      </div>
    </div >
  )
}

export default App