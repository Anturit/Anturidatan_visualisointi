import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import RegisterForm from './components/RegisterForm'
import Togglable from './components/Togglable'
import senderService from './services/senderService'
import SenderList from './components/SenderList'
import registerService from './services/registerService'

function App() {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [senders, setSenders] = useState([])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      const decodedToken = jwt_decode(parsedUser.token)
      console.log(decodedToken)
      const expiresAtMillis = decodedToken.exp * 1000
      if (expiresAtMillis > Date.now()) {
        setUser(parsedUser)
        registerService.setToken(
          parsedUser.token
        )
      }
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const data = await senderService.getAll(user.token)

      setSenders(data)
    }
    if (user) {
      if (user.role === 'admin') {
        fetchData()
      }
    }
  }, [user])

  if (user === null) {
    return <>
      <Notification notification={notification} />
      <LoginForm setUser={setUser} setNotification={setNotification} />
    </>
  }

  if (user.role === 'admin') {
    return (
      <div>
        <Notification notification={notification} />
        <p>{user.name} sisäänkirjautunut</p>
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
        <Togglable buttonLabel='Lisää käyttäjä'>
          <RegisterForm setNotification={setNotification} />
        </Togglable>
        <Togglable buttonLabel='Näytä laitteet'>
          <SenderList senders={senders} />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <p>{user.name} sisäänkirjautunut</p>
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
    </div>
  )
}

export default App
