import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/loginFormReducer'
import {
  useNavigate,
  Link,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import AdminProfile from './components/AdminProfile'
import UserProfile from './components/UserProfile'
import RegisterForm from './components/RegisterForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import userService from './services/userService'
import jwt_decode from 'jwt-decode'
import UserMainView from './components/UserMainView'


function App() {
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()
  const isJsonWebTokenExpired = jwt => {
    const decodedToken = jwt_decode(jwt)
    const expiresAtMillis = decodedToken.exp * 1000
    return expiresAtMillis < Date.now()
  }

  const navigate = useNavigate()


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
      navigate('/admin')
    } else {
      navigate('/user')
    }
 
  }, [])
  const padding = {
    padding: 5
  }

  return (
    <div>
      <Notification />
      {user
        ?
        <>
          <button
            onClick={() => userService.logoutLocalUser(dispatch)}
            data-cy='logout'
          >
            Kirjaudu ulos käyttäjältä {user.firstName} {user.lastName}
          </button>
          <Link style={padding} to="/">Etusivu</Link>
          { user.role === 'admin'
            ?
            <>
              <Link style={padding} to="/users">Käyttäjät</Link>
              <Link style={padding} to="/register">Luo käyttäjä</Link>
            </>
            :
            <Link style={padding} to="/userprofile">Käyttäjätiedot</Link>
          }
          <Routes>

            <Route path="/admin" element={<AdminProfile />} />
            <Route path="/user" element={<UserMainView />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={user.role === 'admin'
              ? <Navigate replace to="/admin" />
              : <Navigate replace to="/user" />}/>
          </Routes>
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