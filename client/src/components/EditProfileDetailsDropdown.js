import React, { useState } from 'react'
import userService from '../services/userService'
import { setNotification } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../reducers/loginFormReducer'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/menuitem'
/**
  * Component to render dropdown menu for user to select which user details to edit.
 */
const EditProfileDetailsDropdown = () => {
  const dispatch = useDispatch()
  const [userInputType, setUserInputType] = useState('address')
  const [userInput, setUserInput] = useState('')

  const user_id = useSelector(state => state.loginForm.user.id)
  /**
   * Checks that no string value in user object is not an empty string.
   * @param {*} userObj
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
      userInputType, userInput
    }
    if (containsEmptyFields(newUser)) {
      dispatch(setNotification('Tyhjiä kenttiä', 3500, 'alert'))
      return
    }
    try {
      const updatedUser = await userService.updateUserDetails(user_id, newUser)
      dispatch(setUser(updatedUser))
      dispatch(setNotification('Tiedon muokkaaminen onnistui!', 3500
      ))
    } catch (error) {
      if (error.response.data.error.includes('invalid postal code')) {
        dispatch(setNotification('Virheellinen postinumero!', 3500, 'alert'))
      } else {
        dispatch(setNotification('Tiedon muokkaaminen epäonnistui!', 3500, 'alert'))
      }
    }
    setUserInput('')
  }

  return (
    <div>
      <h2>Valitse muokattava tieto</h2>
      <div>
        <TextField
          select
          label="Valitse tieto"
          value={userInputType}
          onChange={handleSelectChange}
          data-cy='EditUserDetailsDropdown'
          fullWidth
          variant="outlined"
        >
          <MenuItem value='address'>Osoite</MenuItem>
          <MenuItem value='postalCode'>Postinumero</MenuItem>
          <MenuItem value='city'>Kaupunki</MenuItem>
        </TextField>
      </div>

      {userInputType === 'address' &&
        <form onSubmit={handleSubmit} data-cy='addressForm'>
          <small>Uusi osoite</small>
          <div>
            <TextField
              type="text"
              value={userInput}
              onChange={handleInputChange}
              label="Uusi osoite"
              data-cy='newAddress'
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              onClick={handleSubmit}
              data-cy='addressSubmitButton'
              variant="contained"
              color="primary"
              fullWidth
            >
              Tallenna
            </Button>
          </div>
        </form>
      }

      {userInputType === 'postalCode' &&
        <form onSubmit={handleSubmit} data-cy='postalCodeForm'>
          <small>Uusi postinumero</small>
          <div>
            <TextField
              type="text"
              value={userInput}
              onChange={handleInputChange}
              label="Uusi postinumero"
              data-cy='newPostalCode'
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              onClick={handleSubmit}
              data-cy='postalCodeSubmitButton'
              variant="contained"
              color="primary"
              fullWidth
            >
              Tallenna
            </Button>
          </div>
        </form>
      }

      {userInputType === 'city' &&
        <form onSubmit={handleSubmit} data-cy='cityForm'>
          <small>Uusi kaupunki</small>
          <div>
            <TextField
              type="text"
              value={userInput}
              onChange={handleInputChange}
              label="Uusi kaupunki"
              data-cy='newCity'
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              onClick={handleSubmit}
              data-cy='citySubmitButton'
              variant="contained"
              color="primary"
              fullWidth
            >
              Tallenna
            </Button>
          </div>
        </form>
      }
    </div>
  );
}

export default EditProfileDetailsDropdown;