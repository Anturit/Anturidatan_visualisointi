import { useState } from 'react'

const RegisterForm = () => {
  const roles = ['admin', 'user']

  const [newName, setNewName] = useState('')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState(roles[1])
  const submit = () => {
    console.log('tähän handleRegistration')
  }

  return (
    <div>
      <form>
        <h4>Rekisteröi uusi käyttäjä</h4>
        <label></label>
        <label>Nimi</label>
        <div>
          <input value={newName} id='newFirstName' onChange={(e) => setNewName(e.target.value)}/>
        </div>
        <label>Käyttäjätunnus</label>
        <div>
          <input value={newUsername} id='newUsername' onChange={(e) => setNewUsername(e.target.value)}/>
        </div>
        <div>
          <div>
            <label>Salasana</label>
          </div>
          <input type={'password'} id='newPassword' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
        </div>
        <label>Rooli</label>
        <div>
          <select value={selectedRole} onChange ={(e) => setSelectedRole(e.target.value)}>
            {roles.map((value) => (
              <option value={value} key={value} id='selectedRole'>
                {value}
              </option>
            ))}
          </select>
        </div>
        <p>
          <button type="submit" onClick={submit}>Lisää uusi käyttäjä</button>
        </p>
      </form>
    </div>
  )
}

export default RegisterForm

