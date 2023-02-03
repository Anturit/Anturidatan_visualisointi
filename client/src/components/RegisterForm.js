import { useState } from 'react'
import registerService from '../services/registerService.js'

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
  const [meter, setMeter] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const userObject = {
      username: newAddressLine,
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
      ] }

    await registerService.create(userObject)

    setSelectedRole(roles[1])
    setNewFirstName('')
    setNewSurname('')
    setNewEmail('')
    setNewAddressLine('')
    setNewPostcode('')
    setNewCity('')
    setNewPassword('')
  }

  const eightCharsOrMore = /.{8,}/g
  const atLeastOneUppercase = /[A-Z]/g
  const atLeastOneLowercase = /[a-z]/g
  const atLeastOneNumeric = /[0-9]/g
  const atLeastOneSpecialChar = /[#?!@$%^&*-]/g

  const passwordTracker = {
    uppercase: newPassword.match(atLeastOneUppercase),
    lowercase: newPassword.match(atLeastOneLowercase),
    number: newPassword.match(atLeastOneNumeric),
    specialChar: newPassword.match(atLeastOneSpecialChar),
    eightCharsOrGreater: newPassword.match(eightCharsOrMore),
  }

  const passwordValidation = Object.values(passwordTracker).filter(
    (value) => value
  ).length

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
            onChange ={(e) => setSelectedRole(e.target.value)}>
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
        <input type="date" id="start" name="expiration"
          value={expirationDate.toLocaleDateString('en-CA')}
          data-cy='expirationDate'
          min="2023-01-01" max="2050-01-01"
          onKeyDown={(e) => e.preventDefault()}
          onChange={(e) => setExpirationDate(new Date(e.target.value))
          } />
        <label><h3>Nimi</h3></label>
        <small>Etunimi</small>
        <div>
          <input
            placeholder='esim. Matti'
            data-cy='firstName'
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}/>
        </div>
        <small>Sukunimi</small>
        <div>
          <input
            placeholder='esim. Meikäläinen'
            value={newSurname}
            data-cy='lastName'
            onChange={(e) => setNewSurname(e.target.value)}/>
        </div>
        <div>
          <label><h3>Sähköposti</h3></label>
          <input
            type='email'
            placeholder='esim. testi@email.fi'
            value={newEmail} id='newEmail'
            data-cy='email'
            onChange={(e) => setNewEmail(e.target.value)}/>
        </div>
        <div>
          <label><h3>Osoite</h3></label>
          <small>Katuosoite</small>
          <div>
            <input
              placeholder='esim. Kauppakatu 29'
              value={newAddressLine}
              data-cy='adress'
              onChange={(e) => setNewAddressLine(e.target.value)}/>
          </div>
          <small>Postinumero</small>
          <div>
            <input
              placeholder='esim. 40100'
              value={newPostcode}
              data-cy='postalCode'
              onChange={(e) => setNewPostcode(e.target.value)}/>
          </div>
          <small>Kaupunki</small>
          <div>
            <input
              placeholder='esim. 40100'
              value={newCity}
              data-cy='city'
              onChange={(e) => setNewCity(e.target.value)}/>
          </div>
        </div>
        <label><h3>Salasana</h3></label>
        <small>Käyttäjän salasana</small>
        <div>
          <input
            value={newPassword}
            data-cy='password'
            onFocus={() => setMeter(true)}
            onChange={(e) => setNewPassword(e.target.value)}/>
          {meter && (
            <small>
              <div className="password-strength-meter"></div>
              <div>
                {passwordValidation < 5 && 'Salasanan tulee sisältää: '}
                {!passwordTracker.uppercase && 'iso kirjain, '}
                {!passwordTracker.lowercase && 'pieni kirjain, '}
                {!passwordTracker.specialChar && 'erikoismerkki, '}
                {!passwordTracker.number && 'numero, '}
                {!passwordTracker.eightCharsOrGreater &&
                  'ainakin kahdeksan merkkiä'}
              </div>
            </small>
          )}
        </div>
        <p>
          <button type="submit" onClick={submit}>Lisää uusi käyttäjä</button>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm

