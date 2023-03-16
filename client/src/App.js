import { Routes, Route,  Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/loginFormReducer'
import AdminProfile from './components/AdminProfile'
import UserProfile from './components/UserProfile'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import UserList from './components/UserList'
import userService from './services/userService'
import jwt_decode from 'jwt-decode'

function App() {
  const user = useSelector((state) => state.loginForm.user)

  const dispatch = useDispatch()

  const isJsonWebTokenExpired = jwt => {
    const decodedToken = jwt_decode(jwt)
    const expiresAtMillis = decodedToken.exp * 1000
    return expiresAtMillis < Date.now()
  }

  useEffect(() => {
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

  /*   const padding = {
    padding: 5
  } */

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
          </button></>

        : <></>
      }

      <Routes>
        <Route path="/admin" element={localStorage.getItem('loggedUser') ? <AdminProfile /> : <Navigate replace to='/login' />} />
        <Route path="/users" element={localStorage.getItem('loggedUser') ? <UserList /> : <Navigate replace to='/login' />} />
        <Route path="/user" element={localStorage.getItem('loggedUser') ? <UserProfile /> : <Navigate replace to='/login' />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
      <div>
        <br />
        <em>Anturi app, demo 2023</em>
      </div>
    </div >
  )
}

export default App