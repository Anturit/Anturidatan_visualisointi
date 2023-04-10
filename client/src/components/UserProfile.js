import { useSelector } from 'react-redux'
import Togglable from './Togglable'
import PasswordChangeForm from './PasswordChangeForm'
import EditProfileDetailsDropdown from './EditProfileDetailsDropdown'
import Typography from '@mui/material/Typography'
/**
 * @typedef {import('../services/userService').userObject} userObject
 */

const UserProfile = () => {
  /**
   * Renders user details from user object imported from Redux store.
   * @const
   * @type {userObject}
   */
  const user = useSelector((state) => state.loginForm.user)


  return (
    <>
      <Typography align="center"variant="h2" component="h2">
         Käyttäjätiedot
      </Typography>
      <h2>Käyttäjätiedot</h2>
      <p data-cy="profile_firstname">Etunimi: {user.firstName}</p>
      <p data-cy="profile_last_name">Sukunimi: {user.lastName}</p>
      <p data-cy="profile_username">Käyttäjätunnus: {user.username}</p>
      <p data-cy="profile_address">Osoite: {user.address}</p>
      <p data-cy="profile_postcode">Postinumero: {user.postalCode}</p>
      <p data-cy="profile_city">Kaupunki: {user.city}</p>
      <p data-cy="profile_expiration_Date">Sopimus voimassa {new Date(user.expirationDate).toLocaleDateString('fi-FI')} asti. </p>
      <Togglable buttonLabel='Muokkaa tietoja' id='editForm'>
        <EditProfileDetailsDropdown userDetailsToShow={user} />
        <PasswordChangeForm />
      </Togglable>
    </>
  )
}

export default UserProfile