import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PasswordChangeForm from './components/PasswordChangeForm'
import RegisterForm from './components/RegisterForm'
import Togglable from './components/Togglable'
import UserProfile from './components/UserProfile'
import senderService from './services/senderService'
import SenderDropdown from './components/SenderDropdown'
import SenderList from './components/SenderList'
import UserList from './components/UserList'
import userService from './services/userService'
import jwt_decode from 'jwt-decode'
import { setUser } from './reducers/loginFormReducer'

function App() {
  const user = useSelector((state) => state.loginForm.user)
  const [senders, setSenders] = useState([])
  const dispatch = useDispatch()

  const isJsonWebTokenExpired = jwt => {
    const decodedToken = jwt_decode(jwt)
    const expiresAtMillis = decodedToken.exp * 1000
    return expiresAtMillis < Date.now()
  }

  /**
  * Load user object to program memory if window.localStorage has user object with non-expired JSON web token.
  *
  * @param {any|function} redux store's `dispatch` function
  * @returns {boolean} true for success
  */
  const loginLocalUserIfValidTokenInLocalStorage = (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (!loggedUserJSON) return false

    const parsedUser = JSON.parse(loggedUserJSON)
    if (isJsonWebTokenExpired(parsedUser.token)) return false

    dispatch(setUser(parsedUser))
    userService.setToken(parsedUser.token)
    return true
  }

  useEffect(() => {
    loginLocalUserIfValidTokenInLocalStorage(dispatch)
  }, [])

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
          onClick={() => userService.logoutLocalUser(dispatch)}
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
        onClick={() => userService.logoutLocalUser(dispatch)}
        data-cy='logout'
      >
        Kirjaudu ulos
      </button>
      <UserProfile />
      <Togglable buttonLabel='Muokkaa tietoja' id='editForm'>
        <PasswordChangeForm />
      </Togglable>
      <Togglable buttonLabel='Näytä laitteet' id='senderList'>
        <div>
          {user.senderDeviceIds.length > 1 &&
            <SenderDropdown senderDeviceIds={user.senderDeviceIds} fetchSenderById={fetchSenderById} />
          }
          <SenderList senders={senders} />
        </div>
      </Togglable>
    </div>
  )
}

export default App