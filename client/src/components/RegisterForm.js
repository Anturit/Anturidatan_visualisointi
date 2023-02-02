import { useState } from 'react'
//import axios from 'axios'
import registerService from '../services/registerService.js'

const RegisterForm = () => {

  const roles = ['admin', 'user']
  const [selectedRole, setSelectedRole] = useState(roles[1])
  const [newFirstName, setNewFirstName] = useState('')
  const [newSurname, setNewSurname] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newAddressLine, setNewAddressLine] = useState('')
  const [newPostcode, setNewPostcode] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const submit = (event) => {
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
      expirationDate: '3000-04-20T06:12:14.241Z',
      senderDeviceIds: [
        'E00208B4'
      ] }

    registerService.create(userObject)
  }


  return (
    <div>
      <form>
        <div>
          <h1>Rekisteröintilomake</h1>
        </div>
        <div>
          <label><h3>Käyttäjän rooli</h3></label>
          <p>
            <small>Valitse käyttäjän rooli: <span> </span></small>
            <select
              value={selectedRole}
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
        </div>
        <div>
          <label><h3>Nimi</h3></label>
          <div>
            <small>Etunimi</small>
            <div>
              <input
                placeholder='esim. Matti'
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}/>
            </div>
            <div>
              <small>Sukunimi</small>
              <div>
                <input
                  placeholder='esim. Meikäläinen'
                  value={newSurname}
                  onChange={(e) => setNewSurname(e.target.value)}/>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label><h3>Sähköposti</h3></label>
          <div>
            <div>
              <input
                type='email'
                placeholder='esim. testi@email.fi'
                value={newEmail} id='newEmail'
                onChange={(e) => setNewEmail(e.target.value)}/>
            </div>
          </div>
        </div>
        <div>
          <label><h3>Osoite</h3></label>
          <div>
            <small>Katuosoite</small>
            <div>
              <input
                placeholder='esim. Kauppakatu 29'
                value={newAddressLine}
                onChange={(e) => setNewAddressLine(e.target.value)}/>
            </div>
            <div>
              <small>Postinumero</small>
              <div>
                <input
                  placeholder='esim. 40100'
                  value={newPostcode}
                  onChange={(e) => setNewPostcode(e.target.value)}/>
              </div>
            </div>
          </div>
          <div>
            <small>Kaupunki</small>
            <div>
              <input
                placeholder='esim. 40100'
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}/>
            </div>
          </div>
          <div>
            <small>Maa</small>
            <div>
              <input value={'Suomi'}/>
            </div>
          </div>
        </div>
        <div>
          <label><h3>Salasana</h3></label>
          <div>
            <small>Salasanan tulee sisältää:
              <ul>
                <li>8 merkkiä</li>
                <li>1 isokirjain</li>
                <li>1 pienikirjain</li>
                <li>1 erikoismerkki</li>
                <li>1 numero</li>
              </ul>
            </small>
          </div>
          <div>
            <div>
              <small>Käyttäjän salasana</small>
              <div>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}/>
              </div>
            </div>
          </div>
        </div>
        <p>
          <button type="submit" onClick={submit}>Lisää uusi käyttäjä</button>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm

