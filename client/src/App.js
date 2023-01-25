import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

function App() {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      const decodedToken = jwt_decode(parsedUser.token)
      console.log(decodedToken)
      const expiresAtMillis = decodedToken.exp * 1000
      if (expiresAtMillis > Date.now()) {
        setUser(parsedUser)
      }
    }
  }, [])

  if (user === null) {
    return <>
      <Notification notification={notification} />
      <LoginForm setUser={setUser} setNotification={setNotification} />
    </>
  }

  return (
    <div>
      <Notification notification={notification} />
      <p>{user.name} logged in</p>
      <button
        onClick={
          () => {
            setUser(null)
            window.localStorage.setItem('loggedUser', '')}
        }
      >
        Logout
      </button>
    </div>
  )
}

export default App
