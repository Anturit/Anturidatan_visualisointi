import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/loginFormReducer'
import {
  useLocation,
  useNavigate,
  Link,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import AdminMainView from './components/AdminMainView'
import UserProfile from './components/UserProfile'
<<<<<<< HEAD
import senderService from './services/senderService'
import SenderDropdown from './components/SenderDropdown'
import EditProfileDetailsDropdown from './components/EditProfileDetailsDropdown'
import SenderList from './components/SenderList'
=======
import RegisterForm from './components/RegisterForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
>>>>>>> 5acc32b22ac1898c91d5b11aa487f7376f27daa4
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
      if (['/admin', '/users', '/register', '/userprofile'].includes(location.pathname)) return
      navigate('/admin')
    } else {
      if (['/user', '/userprofile'].includes(location.pathname)) return
      navigate('/user')
    }

  }, [])
<<<<<<< HEAD

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   */
  useEffect(() => {
    const fetchData = async () => {
      const data = await senderService.getOneSenderLogs(
        user.senderDeviceIds[0],
        user.token
      )
      setSenders(data)
    }
    if (user) {
      if (user.role === 'user') {
        fetchData()
      }
    }
  }, [user])


  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   * @param {string} id
   * @param {string} token
   * @returns {Object} sender
   */
  const fetchSenderById = async (id) => {
    const sender = await senderService.getOneSenderLogs(id, user.token)
    setSenders(sender)
  }


  /**
   * If user is not logged in, show login form
   */
  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm />
      </>
    )
  }

  /**
   * If user is logged in as admin, show admin view
   */
  if (user.role === 'admin') {
    return (
      <div>
        <Notification />
        <p>{user.firstName} sisäänkirjautunut</p>
        <button
          onClick={() => {
            dispatch(setUser(null))
            window.localStorage.setItem('loggedUser', '')
            userService.setToken(null)
          }}
          data-cy='logout'
        >
          Kirjaudu ulos
        </button>
        <p></p>
        <Togglable buttonLabel='Lisää käyttäjä' id='registerForm'>
          <RegisterForm />
        </Togglable>
        <UserList />
      </div>
    )
  }

  /**
   * If user is logged in as user, show user view
   */
  return (
    <div>
      <Notification />
      <p>{user.firstName} sisäänkirjautunut</p>
      <button
        onClick={() => {
          dispatch(setUser(null))
          window.localStorage.setItem('loggedUser', '')
        }}
        data-cy='logout'
      >
        Kirjaudu ulos
      </button>
      <UserProfile />
      <Togglable buttonLabel='Muokkaa tietoja' id='editForm'>
        <EditProfileDetailsDropdown userDetailsToShow={user}/>
        <PasswordChangeForm />
      </Togglable>
      <Togglable buttonLabel='Näytä laitteet' id='senderList'>
        <div>
          {user.senderDeviceIds.length > 1 &&
            <SenderDropdown senderDeviceIds={user.senderDeviceIds} fetchSenderById={fetchSenderById} />
=======
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
              <Link style={padding} to="/userprofile">Omat tiedot</Link>
              <Link style={padding} to="/users">Käyttäjät</Link>
              <Link style={padding} to="/register">Luo käyttäjä</Link>
            </>
            :
            <Link style={padding} to="/userprofile">Omat tiedot</Link>
>>>>>>> 5acc32b22ac1898c91d5b11aa487f7376f27daa4
          }
          <Routes>

            <Route path="/admin" element={<AdminMainView />} />
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