import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import userService from '../services/userService'


const AdminProfile = () => {
  /**
                               * Renders user details from user object imported from Redux store.
                               * @const
                               * @type {userObject}
                               */
  const user = useSelector((state) => state.loginForm.user)
  const dispatch = useDispatch()

  // Convert expirationDate to Finnish locale date format
  //const expirationDate = new Date(user.expirationDate).toLocaleDateString('fi-FI')

  return (
    <>

      <h2>Käyttäjätiedot</h2>
      {user ?
        <>{user.firstName}</> :
        <></> }
      <button
        onClick={() => userService.logoutLocalUser(dispatch)}
        data-cy='logout'
      >
        Kirjaudu ulos
      </button>
    </>
  )
}

export default AdminProfile