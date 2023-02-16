import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import RegisterForm from './components/RegisterForm'
import Togglable from './components/Togglable'
import senderService from './services/senderService'
import SenderList from './components/SenderList'
import userService from './services/userService'

function App() {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [senders, setSenders] = useState([])
  const [userDetails, setUserDetails] = useState([])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      console.log(parsedUser)
      const decodedToken = jwt_decode(parsedUser.token)
      console.log(decodedToken)
      const expiresAtMillis = decodedToken.exp * 1000
      if (expiresAtMillis > Date.now()) {
        setUser(parsedUser)
        userService.setToken(
          parsedUser.token
        )
      }
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const data = await senderService.getOneSenderLogs(user.senderDeviceIds[0], user.token)

      setSenders(data)
    }
    if (user) {
      if (user.role === 'user') {
        fetchData()
      }
    }
  }, [user])

  useEffect(() => {
    const fetchUserDetails = async () => {
      const data = await userService.getUserDetails(user.id, user.token)
      setUserDetails(data)
    }
    if (user) {
      if (user.role === 'user') {
        fetchUserDetails()
      }
    }
  }, [user])

  const notificationSetter = (newNotification) => {
    setNotification(newNotification)
    setTimeout(() => {
      setNotification(null)
    }, newNotification.time)
  }

  if (user === null) {
    return <>
      <Notification notification={notification} />
      <LoginForm setUser={setUser} notificationSetter={notificationSetter} />
    </>
  }

  if (user.role === 'admin') {
    return (
      <div>
        <Notification notification={notification} />
        <p>{user.firstName} sisäänkirjautunut</p>
        <button
          onClick={
            () => {
              setUser(null)
              window.localStorage.setItem('loggedUser', '')}
          }
        >
        Kirjaudu ulos
        </button>
        <p></p>
        <Togglable buttonLabel='Lisää käyttäjä' id='registerForm'>
          <RegisterForm notificationSetter={notificationSetter} />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <p>{user.firstName} sisäänkirjautunut</p>
      <button
        onClick={
          () => {
            setUser(null)
            window.localStorage.setItem('loggedUser', '')}
        }
        data-cy="logout"
      >
        Kirjaudu ulos
      </button>

      <Togglable buttonLabel='Näytä laitteet' id='senderList'>
        <SenderList senders={senders} />
      </Togglable>
    </div>
  )
}

export default App
