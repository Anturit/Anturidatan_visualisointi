import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import jwt_decode from 'jwt-decode'
import RegisterForm from './components/RegisterForm'
import Togglable from './components/Togglable'
import UserProfile from './components/UserProfile'
import senderService from './services/senderService'
import SenderDropdown from './components/SenderDropdown'
import SenderList from './components/SenderList'
//import SenderVisualizer from './components/SenderVisualizer'
import UserList from './components/UserList'
import userService from './services/userService'
import { setUser } from './reducers/loginFormReducer'
import store from './store'
function App() {
  const user = useSelector((state) => state.loginForm.user)
  const [senders, setSenders] = useState([])

  /**
   * Function to fetch user for session and storing it to localstorage
   * @returns user object with all fields except passwordHash.
   */
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      const decodedToken = jwt_decode(parsedUser.token)
      const expiresAtMillis = decodedToken.exp * 1000
      if (expiresAtMillis > Date.now()) {
        store.dispatch(setUser(parsedUser))
        userService.setToken(parsedUser.token)
      }
    }
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
          onClick={() => {
            store.dispatch(setUser(null))
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
          store.dispatch(setUser(null))
          window.localStorage.setItem('loggedUser', '')
        }}
        data-cy='logout'
      >
        Kirjaudu ulos
      </button>
      <UserProfile />
      <Togglable buttonLabel='Muokkaa tietoja' id='editForm'></Togglable>
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