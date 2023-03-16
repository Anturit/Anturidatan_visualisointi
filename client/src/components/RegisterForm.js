import { useState } from 'react'
import userService from '../services/userService.js'
import { setNotification } from '../reducers/notificationReducer.js'
import PasswordFeedback from './PasswordFeedback.js'
import { useDispatch } from 'react-redux'

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
    <div>
      <form>
        <h1>Rekisteröintilomake</h1>
        <label><h3>Käyttäjän rooli</h3></label>
        <p>
          <small>Valitse käyttäjän rooli: <span> </span></small>
          <select
            value={selectedRole}
            data-cy='role'
            onChange={(e) => setSelectedRole(e.target.value)}>
            {roles.map((value) => (
              <option
                value={value}
                key={value}>
                {value}
              </option>
            ))}
          </select>
        </p>
        <label><h3>Käyttäjätunnus voimassa: </h3></label>
        <input type="date" name="expiration"
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
          } />
        <label><h3>Nimi</h3></label>
        <small>Etunimi</small>
        <div>
          <input
            placeholder='esim. Matti'
            data-cy='firstName'
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)} />
        </div>
        <small>Sukunimi</small>
        <div>
          <input
            placeholder='esim. Meikäläinen'
            value={newSurname}
            data-cy='lastName'
            onChange={(e) => setNewSurname(e.target.value)} />
        </div>
        <div>
          <label><h3>Sähköposti</h3></label>
          <input
            type='text'
            placeholder='esim. testi@email.fi'
            value={newEmail} id='newEmail'
            data-cy='email'
            onChange={(e) => setNewEmail(e.target.value)} />
        </div>
        <div>
          <label><h3>Osoite</h3></label>
          <small>Katuosoite</small>
          <div>
            <input
              placeholder='esim. Kauppakatu 29'
              value={newAddressLine}
              data-cy='address'
              onChange={(e) => setNewAddressLine(e.target.value)} />
          </div>
          <small>Postinumero</small>
          <div>
            <input
              placeholder='esim. 40100'
              value={newPostcode}
              data-cy='postalCode'
              onChange={(e) => setNewPostcode(e.target.value)} />
          </div>
          <small>Kaupunki</small>
          <div>
            <input
              placeholder='esim. Jyväskylä'
              value={newCity}
              data-cy='city'
              onChange={(e) => setNewCity(e.target.value)} />
          </div>
        </div>
        <label><h3>Salasana</h3></label>
        <small>Käyttäjän salasana</small>
        <div>
          <input
            value={newPassword}
            data-cy='password'
            onFocus={() => setShowPasswordSecurityFeedback(true)}
            onChange={(e) => setNewPassword(e.target.value)} />
          {showPasswordSecurityFeedback && <PasswordFeedback password={newPassword} />}
        </div>
        <p>
          <button type="submit" data-cy='addUser' onClick={submit}>Lisää uusi käyttäjä</button>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm