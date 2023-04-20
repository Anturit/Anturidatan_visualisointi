import React, { useState } from 'react'
import userService from '../services/userService'
import { setNotification } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../reducers/loginFormReducer'
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Typography,
} from '@mui/material'

/**
 * Component to render dropdown menu for user to select which user details to edit.
 */
const EditProfileDetailsDropdown = () => {
  const dispatch = useDispatch()
  const [userInputType, setUserInputType] = useState('address')
  const [userInput, setUserInput] = useState('')

  const user_id = useSelector((state) => state.loginForm.user.id)
  const user_token = useSelector((state) => state.loginForm.user.token)
  /**
   * Checks that no string value in user object is not an empty string.
   * @param {*} userObj
   * @returns {boolean}
   */
  const containsEmptyFields = (userObj) => {
    for (const key in userObj) {
      if (
        typeof userObj[key] === 'string' &&
        userObj[key].replace(/\s/g, '') === ''
      ) {
        return true
      }
    }
    return false
  }

  /**
   * Constant to handle change in dropdown menu.
   * @param {*} event
   */
  const handleSelectChange = (event) => {
    setUserInputType(event.target.value)
  }

  /**
   * Constant to handle input change in the input field.
   * @param {*} event
   */
  const handleInputChange = (event) => {
    setUserInput(event.target.value)
  }

  /**
   * Constant to handle form submit and update user details.
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    const newUser = {
      userInputType,
      userInput,
    }
    if (containsEmptyFields(newUser)) {
      dispatch(setNotification('Tyhjiä kenttiä', 3500, 'alert'))
      return
    }
    try {
      const updatedUser = await userService.updateUserDetails(user_id, newUser)
      updatedUser['token'] = user_token
      dispatch(setUser(updatedUser))
      dispatch(setNotification('Tiedon muokkaaminen onnistui!', 3500))
    } catch (error) {
      if (error.response.data.error.includes('invalid postal code')) {
        dispatch(setNotification('Virheellinen postinumero!', 3500, 'alert'))
      } else {
        dispatch(
          setNotification('Tiedon muokkaaminen epäonnistui!', 3500, 'alert')
        )
      }
    }
    setUserInput('')
  }

  return (
    <div>
      <Typography align='center' variant='h2' component='h2'>
        Valitse muokattava tieto
      </Typography>
      <div>
        <FormControl fullWidth variant='outlined'>
          <InputLabel htmlFor='details'>Valitse tieto</InputLabel>
          <Select
            label='Valitse tieto'
            value={userInputType}
            onChange={handleSelectChange}
            inputProps={{ name: 'details', id: 'details' }}
            data-cy='EditUserDetailsDropdown'
          >
            <MenuItem value='address' data-cy='select-option-address'>
              Osoite
            </MenuItem>
            <MenuItem value='postalCode' data-cy='select-option-postalcode'>
              Postinumero
            </MenuItem>
            <MenuItem value='city' data-cy={'select-option-city'}>
              Kaupunki
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      {userInputType === 'address' && (
        <form onSubmit={handleSubmit} data-cy='addressForm'>
          <small>Uusi osoite</small>
          <div>
            <TextField
              type='text'
              value={userInput}
              onChange={handleInputChange}
              data-cy='newAddress'
            />
            <Button
              type='submit'
              onClick={handleSubmit}
              data-cy='addressSubmitButton'
              variant='contained'
              color='secondary'
            >
              Tallenna
            </Button>
          </div>
        </form>
      )}

      {userInputType === 'postalCode' && (
        <form onSubmit={handleSubmit} data-cy='postalCodeForm'>
          <small>Uusi postinumero</small>
          <div>
            <TextField
              type='text'
              value={userInput}
              onChange={handleInputChange}
              data-cy='newPostalCode'
            />
            <Button
              type='submit'
              onClick={handleSubmit}
              data-cy='postalCodeSubmitButton'
              variant='contained'
              color='secondary'
            >
              Tallenna
            </Button>
          </div>
        </form>
      )}

      {userInputType === 'city' && (
        <form onSubmit={handleSubmit} data-cy='cityForm'>
          <small>Uusi kaupunki</small>
          <div>
            <TextField
              type='text'
              value={userInput}
              onChange={handleInputChange}
              data-cy='newCity'
            />
            <Button
              type='submit'
              onClick={handleSubmit}
              data-cy='citySubmitButton'
              variant='contained'
              color='secondary'
            >
              Tallenna
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default EditProfileDetailsDropdown
