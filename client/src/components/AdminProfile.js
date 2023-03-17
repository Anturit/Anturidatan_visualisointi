import { useSelector } from 'react-redux'
//import { Link } from 'react-router-dom'

const AdminProfile = () => {
  /**
                               * Renders user details from user object imported from Redux store.
                               * @const
                               * @type {userObject}
                               */
  const user = useSelector((state) => state.loginForm.user)

  /*   const padding = {
    padding: 5
  } */

  return (
    <>
      <h2>Käyttäjienhallinta</h2>
      <>Admin {user.username} kirjautunut</>
    </>
  )
}

export default AdminProfile