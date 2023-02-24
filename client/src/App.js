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
//import { setNotification } from './reducers/notificationReducer'
function App() {
  const user = useSelector((state) => state.loginForm.user)
  const [notification, setNotification] = useState(null)
  const [senders, setSenders] = useState([])

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

  const notificationSetter = (newNotification) => {
    setNotification(newNotification)
    setTimeout(() => {
      setNotification(null)
    }, newNotification.time)
  }

  const fetchSenderById = async (id) => {
    const sender = await senderService.getOneSenderLogs(id, user.token)
    setSenders(sender)
  }

  if (user === null) {
    return (
      <>
        <Notification notification={notification} />
        <LoginForm />
      </>
    )
  }

  if (user.role === 'admin') {
    return (
      <div>
        <Notification notification={notification} />
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
          <RegisterForm notificationSetter={notificationSetter} />
        </Togglable>
        <UserList notificationSetter={notificationSetter}/>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
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
