import React from 'react'
import { useSelector } from 'react-redux'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Togglable from './Togglable'
import PasswordChangeForm from './PasswordChangeForm'
import EditProfileDetailsDropdown from './EditProfileDetailsDropdown'

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography align="center" variant="h2" component="h2">
        Käyttäjätiedot
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" component="h2">
          Etunimi: {user.firstName}
        </Typography>
        <Typography variant="h6" component="h2">
          Sukunimi: {user.lastName}
        </Typography>
        <Typography variant="h6" component="h2">
          Käyttäjätunnus: {user.username}
        </Typography>
        <Typography variant="h6" component="h2">
          Osoite: {user.address}
        </Typography>
        <Typography variant="h6" component="h2">
          Postinumero: {user.postalCode}
        </Typography>
        <Typography variant="h6" component="h2">
          Kaupunki: {user.city}
        </Typography>
        <Typography variant="h6" component="h2">
          Sopimus voimassa{' '}
          {new Date(user.expirationDate).toLocaleDateString('fi-FI')} asti.
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Togglable buttonLabel='Muokkaa tietoja' id='editForm'>
          <EditProfileDetailsDropdown userDetailsToShow={user} />
          <PasswordChangeForm />
        </Togglable>
      </Box>
    </Box>
  )
}

export default UserProfile