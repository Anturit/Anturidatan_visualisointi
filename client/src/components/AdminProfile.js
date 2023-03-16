import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const AdminProfile = () => {
  /**
                               * Renders user details from user object imported from Redux store.
                               * @const
                               * @type {userObject}
                               */
  const user = useSelector((state) => state.loginForm.user)

  const padding = {
    padding: 5
  }

  return (
    <>
      <Link style={padding} to="/users">Käyttäjät</Link>
      <Link style={padding} to="/create_user">Luo käyttäjä</Link>
      <h2>Käyttäjienhallinta</h2>
      <>Admin {user.username} kirjautunut</>
    </>
  )
}

export default AdminProfile