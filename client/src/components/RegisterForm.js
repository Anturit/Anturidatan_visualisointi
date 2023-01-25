import { useState } from 'react'

const RegisterForm = () => {
  const roles = ['Admin', 'User']

  const [newUser, setNewUser] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState(roles[0])

  const submit = () => {
    console.log(newUser)
    console.log(newPassword)
    console.log(selectedRole)
    console.log('tähän handleRegistration')
  }

  return (
    <div>
      <form>
        <div>
          <h4>Rekisteröi uusi käyttäjä</h4>
          <label>Käyttäjänimi</label>
        </div>
        <input value={newUser} onChange={(e) => setNewUser(e.target.value)}/>
        <div>
          <div>
            <label>Salasana</label>
          </div>
          <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
        </div>
        <label>Rooli</label>
        <div>
          <select value={selectedRole} onChange ={(e) => setSelectedRole(e.target.value)}>
            {roles.map((value) => (
              <option value={value} key={value}>
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

