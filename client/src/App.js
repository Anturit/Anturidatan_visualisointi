import LoginForm from './components/LoginForm'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

function App() {
  const [user, setUser] = useState(null)

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

  return (
    <>
      {user === null
        ?<LoginForm setUser={setUser}/>
        : <>
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
        </>
      }
    </>
  )
}

export default App
