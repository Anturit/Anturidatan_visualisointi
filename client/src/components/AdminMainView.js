import { useSelector } from 'react-redux'

const AdminMainView = () => {
  /**
                               * Renders user details from user object imported from Redux store.
                               * @const
                               * @type {userObject}
                               */
  const user = useSelector((state) => state.loginForm.user)
  const date = new Date(user.expirationDate).toISOString().replace('-', '/').split('T')[0].replace('-', '/')
  return (
    <>
      <h2>Käyttäjienhallinta</h2>
      <>ADMININ KÄYTTÄJÄTUNNUS VANHENEE:  { date }</>
    </>
  )
}

export default AdminMainView