import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import Togglable from './Togglable'
import PasswordChangeForm from './PasswordChangeForm'
import SenderDropdown from './SenderDropdown'
import SenderList from './SenderList'
import senderService from '../services/senderService'

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


  const [senders, setSenders] = useState([])
  // Convert expirationDate to Finnish locale date format
  //const expirationDate = new Date(user.expirationDate).toLocaleDateString('fi-FI')

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   */
  useEffect(() => {
    if (user) {
      const fetchSenderData = async () => {
        const data = await senderService.getOneSenderLogs(
          user.senderDeviceIds[0],
          user.token
        )
        setSenders(data)
      }
      fetchSenderData()
    }
  }, [user])

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   * @param {string} id
   * @param {string} token
   * @returns {Object} sender
   */
  const fetchSenderById = async (id) => {
    const sender = await senderService.getOneSenderLogs(id, user.token)
    setSenders(sender)
  }
  return (
    <>
      {user ?
        <>
          <h2>Käyttäjätiedot</h2>
          <p data-cy="profile_firstname">Etunimi: {user.firstName}</p>
          <p data-cy="profile_last_name">Sukunimi: {user.lastName}</p>
          <p data-cy="profile_username">Käyttäjätunnus: {user.username}</p>
          <p data-cy="profile_address">Osoite: {user.address}</p>
          <p data-cy="profile_postcode">Postinumero: {user.postalCode}</p>
          <p data-cy="profile_city">Kaupunki: {user.city}</p>
          <p data-cy="profile_expiration_Date">Sopimus voimassa {new Date(user.expirationDate).toLocaleDateString('fi-FI')} asti. </p>
          <Togglable buttonLabel='Muokkaa tietoja' id='editForm'>
            <PasswordChangeForm />
          </Togglable>
          <Togglable buttonLabel='Näytä laitteet' id='senderList'>
            <>
              {user.senderDeviceIds.length > 1 &&
                <SenderDropdown senderDeviceIds={user.senderDeviceIds} fetchSenderById={fetchSenderById} />
              }
              <SenderList senders={senders} />
            </ >
          </Togglable>
        </ >
        :
        <></ >
      }
    </>
  )
}

export default UserProfile