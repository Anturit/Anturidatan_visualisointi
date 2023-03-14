import { Routes, Route, Link, Navigate } from 'react-router-dom'

import LoginForm from './components/LoginForm'
//import Notification from './components/Notification'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/* import PasswordChangeForm from './components/PasswordChangeForm'
import RegisterForm from './components/RegisterForm'
import Togglable from './components/Togglable'
import UserProfile from './components/UserProfile'
import senderService from './services/senderService'
import SenderDropdown from './components/SenderDropdown'
import SenderList from './components/SenderList' */
import UserList from './components/UserList'
import userService from './services/userService'
import jwt_decode from 'jwt-decode'
import { setUser } from './reducers/loginFormReducer'
import AdminProfile from './components/AdminProfile'

function App() {
  const padding = {
    padding: 5
  }
  const user = useSelector((state) => state.loginForm.user)
  console.log('user', user)
  // const [senders, setSenders] = useState([])
  const dispatch = useDispatch()

  const isJsonWebTokenExpired = jwt => {
    const decodedToken = jwt_decode(jwt)
    const expiresAtMillis = decodedToken.exp * 1000
    return expiresAtMillis < Date.now()
  }

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

  //const navigate = useNavigate()

  return (
    <div>
      <Link style={padding} to="/users">users</Link>
      <button
        onClick={() => userService.logoutLocalUser(dispatch)}
        data-cy='logout'
      >
        Kirjaudu ulos
      </button>
      {user
        ? <em>{user.firstName} logged in</em>


        : <Link style={padding} to="/login">login</Link>
      }

      <Routes>

        <Route path="/admin" element={localStorage.getItem('loggedUser') ? <AdminProfile /> : <Navigate replace to='/login' />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/login" element={<LoginForm />} />

      </Routes>
      <div>
        <br />
        <em>Note app, Department of Computer Science 2023</em>
      </div>
    </div >
  )
}

export default App