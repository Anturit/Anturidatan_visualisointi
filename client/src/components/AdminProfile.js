//import { useSelector } from 'react-redux'

const AdminProfile = () => {
  /**
                               * Renders user details from user object imported from Redux store.
                               * @const
                               * @type {userObject}
                               */
  //const user = useSelector((state) => state.loginForm.user)


  // Convert expirationDate to Finnish locale date format
  //const expirationDate = new Date(user.expirationDate).toLocaleDateString('fi-FI')

  return (
    <>

      <h2>Käyttäjienhallinta</h2>
      <>Admin kirjautunut</>
    </>
  )
}

export default AdminProfile