const RegisterForm = () => {

    return (
      <form onSubmit={addUser}>
          <div>
          username:
            <input
              onChange={handleNameChange}
            />
          </div>
          <div>
          password:
            <input
            onChange={handlePasswordChange}
            />
          </div>
          <div>
          role:
              <select>
              <option value="admin">Admin</option>
              <option value="customer">Asiakas</option>
              </select>
          </div>
          <div>
            <button type='submit'>Lisää uusi käyttäjä</button>
          </div>
        </form>
      )
    }

  export default RegisterForm