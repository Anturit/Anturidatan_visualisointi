import React, { useState } from 'react'
import store from '../store.js'
import userService from '../services/userService'
import { setNotification } from '../reducers/notificationReducer'
import { useSelector } from 'react-redux'
/**
  * Component to render dropdown menu for user to select which user details to edit.
 */
const EditProfileDetailsDropdown = () => {
  const [selectedValue, setSelectedValue] = useState('address')
  const [inputValue, setInputValue] = useState('')

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
    setSelectedValue(event.target.value)
  }

  /**
    * Constant to handle input change in the input field.
    * @param {*} event
  */
  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  /**
    * Constant to handle form submit and update user details.
    * @param {*} event
  */
  const handleSubmit = async (event) => {
    event.preventDefault()
    const updatedUser = {
      selectedValue, inputValue
    }
    if (containsEmptyFields(updatedUser)) {
      store.dispatch(setNotification('Tyhjiä kenttiä', 3500, 'alert'))
      return
    }
    try {
      await userService.updateUserDetails(user_id, updatedUser)
      store.dispatch(setNotification('Tiedon muokkaaminen onnistui!', 15000
      ))
    } catch (error) {
      store.dispatch(setNotification('Tiedon muokkaaminen epäonnistui!', 15000, 'alert'))
    }
    setInputValue('')
  }

  return (
    <div>
      <h2>Valitse muokattava tieto</h2>
      <div>
        <select name='details' id='details' onChange={handleSelectChange} data-cy='EditUserDetailsDropdown'>
          <option key='address' value='address'>Osoite</option>
          <option key='postalCode' value='postalCode'>Postinumero</option>
          <option key='city' value='city'>Kaupunki</option>
        </select>
      </div>

      {selectedValue === 'address' &&
      <form onSubmit={handleSubmit} data-cy='addressForm'>
        <small>Uusi osoite</small>
        <div>
          <input type="text" value={inputValue} onChange={handleInputChange} data-cy='newAddress'/>
          <button type="submit" onClick={handleSubmit} data-cy='addressSubmitButton'>Tallenna</button>
        </div>
      </form>
      }

      {selectedValue === 'postalCode' &&
      <form onSubmit={handleSubmit} data-cy='postalCodeForm'>
        <small>Uusi postinumero</small>
        <div>
          <input type="text" value={inputValue} onChange={handleInputChange} data-cy='newPostalCode'/>
          <button type="submit" onClick={handleSubmit} data-cy='postalCodeSubmitButton'>Tallenna</button>
        </div>
      </form>
      }

      {selectedValue === 'city' &&

      <form onSubmit={handleSubmit} data-cy='cityForm'>
        <small>Uusi kaupunki</small>
        <div>
          <input type="text" value={inputValue} onChange={handleInputChange} data-cy='newCity'/>
          <button type="submit" onClick={handleSubmit} data-cy='citySubmitButton'>Tallenna</button>
        </div>
      </form>
      }
    </div>
  )
}

export default EditProfileDetailsDropdown
