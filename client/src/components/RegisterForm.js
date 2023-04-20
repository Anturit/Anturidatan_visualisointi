import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer.js'
import PasswordFeedback from './PasswordFeedback.js'
import userService from '../services/userService.js'
import { Box, Button, Container, MenuItem, Select, TextField, Typography } from '@mui/material' // eslint-disable-line

/**
 * @typedef {import('../services/userService').userObject} userObject
 */

const RegisterForm = () => {
  const roles = ['admin', 'user']
  const [selectedRole, setSelectedRole] = useState(roles[1])
  const [expirationDate, setExpirationDate] = useState(new Date)
  const [newFirstName, setNewFirstName] = useState('')
  const [newSurname, setNewSurname] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newAddressLine, setNewAddressLine] = useState('')
  const [newPostcode, setNewPostcode] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPasswordSecurityFeedback, setShowPasswordSecurityFeedback] = useState(false)
  const dispatch = useDispatch()

  /**
   * Checks that no string value in user object is not an empty string.
   * @param {userObject} userObj
   * @returns {boolean}
   */
  const containsEmptyFields = (userObj) => {
    for (const key in userObj) {
      if (typeof userObj[key] === 'string'
        && userObj[key].replace(/\s/g, '') === '') {
        return true
      }
    }
    return false
  }

  const createUserObjectFromStates = () => ({
    username: newEmail,
    password: newPassword,
    firstName: newFirstName,
    lastName: newSurname,
    address: newAddressLine,
    postalCode: newPostcode,
    city: newCity,
    role: selectedRole,
    expirationDate: expirationDate,
    senderDeviceIds: [
      'E00208B4'
    ]
  })

  const resetRegisterFormStates = () => {
    setSelectedRole(roles[1])
    setNewFirstName('')
    setNewSurname('')
    setNewEmail('')
    setNewAddressLine('')
    setNewPostcode('')
    setNewCity('')
    setNewPassword('')
  }

  const errorMessagesInFinnish = [
    ['unique', 'Käyttäjä tällä sähköpostilla on jo olemassa!'],
    ['password', 'Salasana ei kelpaa!'],
    ['invalid postal code', 'Virheellinen postinumero!'],
    ['invalid email address', 'Virheellinen sähköpostiosoite!'],
  ]

  /**
   * Returns corresponding error message in finnish
   * @param {string} errorText
   * @returns {string} Error text in finnish
   */
  const getErrorMessageInFinnish = (errorText) => {
    for (const [english, finnish] of errorMessagesInFinnish) {
      if (errorText.includes(english)) {
        return finnish
      }
    }
    return 'Tuntematon virhe lomakkeen lähettämisessä'
  }
  /**
   * Register form event handler
   * @param {onClick} event - The observable event.
  *  @listens onClick
   */
  const submit = async (event) => {
    event.preventDefault()
    const userObject = createUserObjectFromStates()
    if (containsEmptyFields(userObject)) {
      dispatch(setNotification(
        'Tyhjiä kenttiä', 3500, 'alert'
      ))
      return
    }
    try {
      await userService.create(userObject)
      dispatch(setNotification(
        `Käyttäjän luonti onnistui! Käyttäjänimi: ${newEmail} Salasana: ${newPassword}`, 15000
      ))
      resetRegisterFormStates()
    } catch (err) {
      dispatch(setNotification(
        getErrorMessageInFinnish(err.response.data.error), 3500, 'alert'
      ))
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', id: 'registerForm' }}>
        <Box component='form' onSubmit={submit}>
          <Typography component='h2' variant='h2'>
            Rekisteröintilomake
          </Typography>
          <Box sx={{ id: 'role', marginTop: 4 }}>
            <Typography component='h4' variant='h4'>
                Käyttäjän rooli
            </Typography>
            <Select
              value={selectedRole}
              data-cy='role'
              onChange={(e) => setSelectedRole(e.target.value)}
              sx={{ mt: 2 }}>
              {roles.map((value) => (
                <MenuItem value={value} key={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ id: 'expirationDate', mt: 4 }}>
            <Typography component='h4' variant='h4'>
              Käyttäjätunnus voimassa
            </Typography>
            <TextField
              type='date'
              name='expiration'
              value={expirationDate.toISOString().substring(0, 10)}
              data-cy='expirationDate'
              max="2100-01-01"
              onChange={(e) =>
                setExpirationDate(
                  e.target.value === ''
                    ? new Date()
                    : new Date(e.target.value) > new Date('2100-01-01')
                      ? new Date('2100-01-01')
                      : new Date(e.target.value))
              }
              sx={{ mt: 2 }}
            />
          </Box>
          <Box sx={{ id: 'name', marginTop: 4 }}>
            <Typography component='h4' variant='h4'>
              Nimi
            </Typography>
            <TextField
              label='Etunimi'
              value={newFirstName}
              data-cy='firstName'
              onChange={(e) => setNewFirstName(e.target.value)}
              sx={{ mt: 2, mr: 2 }}
            />
            <TextField
              label='Sukunimi'
              value={newSurname}
              data-cy='lastName'
              onChange={(e) => setNewSurname(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box sx={{ id: 'email', marginTop: 4 }}>
            <Typography component='h4' variant='h4'>
              Sähköposti
            </Typography>
            <TextField
              label='Sähköposti'
              value={newEmail}
              id='newEmail'
              data-cy='email'
              onChange={(e) => setNewEmail(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
          <Box sx={{ id: 'address', marginTop: 4 }}>
            <Typography component='h4' variant='h4'>
              Osoite
            </Typography>
            <Box sx={{ id: 'street' }}>
              <TextField
                label='Katuosoite'
                value={newAddressLine}
                data-cy='address'
                onChange={(e) => setNewAddressLine(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
            <Box sx={{ id: 'postalCode' }}>
              <TextField
                label='Postinumero'
                value={newPostcode}
                data-cy='postalCode'
                onChange={(e) => setNewPostcode(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
            <Box sx={{ id: 'city' }}>
              <TextField
                label='Kaupunki'
                value={newCity}
                data-cy='city'
                onChange={(e) => setNewCity(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>
          <Box sx={{ id: 'password', marginTop: 4 }}>
            <Typography component='h4' variant='h4'>
              Salasana
            </Typography>
            <Box>
              <TextField
                label='Salasana'
                value={newPassword}
                data-cy='password'
                onFocus={() => setShowPasswordSecurityFeedback(true)}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mt: 2 }}
              />
              {showPasswordSecurityFeedback && <PasswordFeedback password={newPassword} />}
            </Box>
            <Button
              type='submit'
              data-cy='addUser'
              color='secondary'
              variant='contained'
              onClick={submit}
              sx={{ mt: 4 }}
            >
              Lisää uusi käyttäjä
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default RegisterForm