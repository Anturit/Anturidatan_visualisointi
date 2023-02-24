import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import RegisterForm from './components/RegisterForm'
import Togglable from './components/Togglable'
import UserProfile from './components/UserProfile'
import senderService from './services/senderService'
import SenderDropdown from './components/SenderDropdown'
import SenderList from './components/SenderList'
import UserList from './components/UserList'
import userService from './services/userService'

function App() {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [senders, setSenders] = useState([])
  const [userDetails, setUserDetails] = useState([])

  useEffect(() => {
    /**
     * Function to fetch user for session and storing it to localstorage
     * @returns user object with all fields except passwordHash.
     */
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      const decodedToken = jwt_decode(parsedUser.token)
      const expiresAtMillis = decodedToken.exp * 1000
      if (expiresAtMillis > Date.now()) {
        setUser(parsedUser)
        userService.setToken(parsedUser.token)
      }
    }
  }, [])

  useEffect(() => {
    /**
     * Function to fetch user details for user
     * @returns user object.
     */
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

  useEffect(() => {
    /**
     * Function to fetch senders for user
     * @returns sender object.
     */
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


  const notificationSetter = (newNotification) => {
    /**
     * Function to set notification and clear it after set time
     * @param {Object} newNotification
     * @param {string} newNotification.message
     * @param {string} newNotification.type
     * @param {number} newNotification.time
     * @returns null
     */

    setNotification(newNotification)
    setTimeout(() => {
      setNotification(null)
    }, newNotification.time)
  }

  const fetchSenderById = async (id) => {
    /**
     * Function to fetch sender by id
     * @param {string} id
     * @returns sender object.
     */
    const sender = await senderService.getOneSenderLogs(id, user.token)
    setSenders(sender)
  }

  if (user === null) {
    /**
     * If user is not logged in, render login form
     * @returns login form
     */
    return (
      <>
        <Notification notification={notification} />
        <LoginForm setUser={setUser} notificationSetter={notificationSetter} />
      </>
    )
  }

  if (user.role === 'admin') {
    /**
     * If user is type admin, render admin view
     * @returns admin view
     */
    return (
      <div>
        <Notification notification={notification} />
        <p>{user.firstName} sisäänkirjautunut</p>
        <button
          onClick={() => {
            setUser(null)
            window.localStorage.setItem('loggedUser', '')
            userService.setToken(null)
          }}
          data-cy='logout'
        >
          Kirjaudu ulos
        </button>
        <p></p>
        <Togglable buttonLabel='Lisää käyttäjä' id='registerForm'>
          <RegisterForm notificationSetter={notificationSetter} />
        </Togglable>
        <UserList notificationSetter={notificationSetter}/>
      </div>
    )
  }

  /**
   * If user is type user, render user view
   */

  return (
    <div>
      <Notification notification={notification} />
      <p>{user.firstName} sisäänkirjautunut</p>
      <button
        onClick={() => {
          setUser(null)
          window.localStorage.setItem('loggedUser', '')
        }}
        data-cy='logout'
      >
        Kirjaudu ulos
      </button>
      <UserProfile userDetails={userDetails} />
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
