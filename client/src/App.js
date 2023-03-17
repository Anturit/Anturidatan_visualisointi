import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/loginFormReducer'
import AdminProfile from './components/AdminProfile'
import UserProfile from './components/UserProfile'
import RegisterForm from './components/RegisterForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import Home from './components/Home'
import userService from './services/userService'
import jwt_decode from 'jwt-decode'
import { Link } from 'react-router-dom'

function App() {
  const user = useSelector((state) => state.loginForm.user)
  console.log('user appissa',user)
  const dispatch = useDispatch()

  const isJsonWebTokenExpired = jwt => {
    const decodedToken = jwt_decode(jwt)
    const expiresAtMillis = decodedToken.exp * 1000
    return expiresAtMillis < Date.now()
  }
  /*   useEffect(() => {
    if (user) {
      dispatch(setUser(user))
    }
  }, [user]) */

  useEffect(() => {
    console.log('useEffect')
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON)
      if (!isJsonWebTokenExpired(parsedUser.token)) {
        console.log(' usertoken Appissa', parsedUser.token)
        dispatch(setUser(parsedUser))
        userService.setToken(parsedUser.token)
      }
    }
  }, [])
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
            Kirjaudu ulos
          </button>
          <Link style={padding} to="/">Etusivu</Link>
          { (user.role === 'admin') &&
          <>
            <Link style={padding} to="/users">Käyttäjät</Link>
            <Link style={padding} to="/register">Luo käyttäjä</Link>
          </>
          }
          <Routes>

            <Route path="/admin" element={<AdminProfile />} />
            <Route path="/user" element={<UserProfile />} />
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/register" element={<RegisterForm />} />

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