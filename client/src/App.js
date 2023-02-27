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
   * Function to fetch user details for user
   * @returns user object.
   */
  useEffect(() => {
    const fetchUserDetails = async () => {
      const data = await userService.getUser(user.id)
      setUserDetails(data)
    }
    if (user) {
      if (user.role === 'user') {
        fetchUserDetails()
      }
    }
  }, [user])


  /**
   * Function to fetch user details for user
   * @returns user object.
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
   * Function to fetch sender by id
   * @param {string} id
   * @returns sender object.
   */
  const fetchSenderById = async (id) => {
    const sender = await senderService.getOneSenderLogs(id, user.token)
    setSenders(sender)
  }


   /**
   * If user is not logged in, render login form
   * @returns login form
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
  * If user is type admin, render admin view
  * @returns admin view
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
   * If user is type user, render user view
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
