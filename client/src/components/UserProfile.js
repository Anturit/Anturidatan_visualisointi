import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material'
import Togglable from './Togglable'
import PasswordChangeForm from './PasswordChangeForm'
import EditProfileDetailsDropdown from './EditProfileDetailsDropdown'
import userService from '../services/userService'

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
  const dispatch = useDispatch()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography align="center" variant="h2" component="h2">
        Omat tiedot
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
      <Box sx={{ mt: 2, mb: 2 }}>
        <Togglable buttonLabel='Muokkaa tietoja' id='editForm'>
          <EditProfileDetailsDropdown userDetailsToShow={user} />
          <br />
          <PasswordChangeForm />
        </Togglable>
      </Box>
      <Button color="primary" variant="contained" onClick={() => userService.logoutLocalUser(dispatch)}
        data-cy='logout'>Kirjaudu ulos</Button>
    </Box>
  )
}

export default UserProfile