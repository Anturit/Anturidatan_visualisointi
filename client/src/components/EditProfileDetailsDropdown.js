import React, { useState } from 'react'
import store from '../store.js'
import userService from '../services/userService'
import { setNotification } from '../reducers/notificationReducer'

/**
  * Component to render dropdown menu for user to select which user details to edit.
 */
const EditProfileDetailsDropdown = ({ userDetailsToShow }) => {

  const [selectedValue, setSelectedValue] = useState(userDetailsToShow.address)
  const [inputValue, setInputValue] = useState('')

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
      [selectedValue]: inputValue
    }
    if (containsEmptyFields(updatedUser)) {
      store.dispatch(setNotification('Tyhjiä kenttiä', 3500, 'alert'))
      return
    }
    try {
      await userService.updateUserDetails(userDetailsToShow.id, updatedUser)
      store.dispatch(setNotification('Tiedon muokkaaminen onnistui!', 15000
      ))
    } catch (error) {
      store.dispatch(setNotification('Tiedon muokkaaminen epäonnistui!', 15000, 'alert'))
    }
    setInputValue('')
  }

  return (
    <div>
      <h3>Valitse muokattava tieto:</h3>
      <div>
        <select name='details' id='details' onChange={handleSelectChange} data-cy='EditUserDetailsDropdown'>
          <option key='address' value={userDetailsToShow.address}>{userDetailsToShow.address}</option>
          <option key='postalCode' value={userDetailsToShow.postalCode}>{userDetailsToShow.postalCode}</option>
          <option key='city' value={userDetailsToShow.city}>{userDetailsToShow.city}</option>
        </select>
      </div>

      {selectedValue === userDetailsToShow.address &&
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange}/>
        <button type="submit" onClick={handleSubmit}>Tallenna</button>
      </form>
      }

      {selectedValue === userDetailsToShow.postalCode &&
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange}/>
        <button type="submit" onClick={handleSubmit}>Tallenna</button>
      </form>
      }

      {selectedValue === userDetailsToShow.city &&
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={inputValue} onChange={handleInputChange}/>
          <button type="submit" onClick={handleSubmit}>Tallenna</button>
        </form>
      </div>}
    </div>
  )
}

export default EditProfileDetailsDropdown
