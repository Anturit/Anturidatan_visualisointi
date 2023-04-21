import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setUsers } from '../reducers/usersReducer'
import userService from '../services/userService'
import { useState } from 'react'


/**
 * @param {Object} user
 * @param {Function} onClose
 * @returns {JSX.Element} JSX element
 * @constructor
 * @description Modal for editing user details (username, expiration date)
 */
const EditUserDetails = ({ user, onClose }) => {

  const style = {
    paddingBottom: 2,
    paddingTop: 2,
  }

  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()
  const [expirationDate, setExpirationDate] = useState()
  const [email, setEmail] = useState()

  const handleSaveUserDetails = async () => {

    const updatedUser = {
      ...user,
      expirationDate: expirationDate,
      username: email,
    }

    if (updatedUser.username === undefined) {
      updatedUser.username = user.username
    }

    if (updatedUser.expirationDate === undefined) {
      updatedUser.expirationDate = user.expirationDate
    }

    try {
      await userService.changeUserDetails(user.id, updatedUser)
      const updatedUsers = users.map((u) => u.id === user.id ? updatedUser : u)
      dispatch(setUsers(updatedUsers))
      onClose()
      dispatch(setNotification(`Käyttäjän ${user.firstName} tiedot päivitetty`, 3500, 'success'))
    } catch (error) {
      dispatch(setNotification('Käyttäjän tietojen päivitys epäonnistui', 3500, 'error'))
      onClose()
    }
  }

  return (
    <div>
      <Typography variant="h6" component="h2" sx={style}>
        Muokkaa käyttäjän {user.firstName} tietoja
      </Typography>

      <Typography variant="body1" component="p" sx={style}>
        Uusi lisenssin vanhentumispäivä
      </Typography>
      <TextField
        data-cy='changeExpirationDate'
        id="date"
        label="Vanhentumispäivä"
        type="date"
        InputLabelProps={{
          shrink: true,
        }}

        onChange={(event) => { setExpirationDate(event.target.value) }}
      />
      <Typography variant="body1" component="p" sx={style}>
        Uusi sähköposti </Typography>

      <TextField
        data-cy='changeEmail'
        id="email"
        label="Sähköposti"
        type="email"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(event) => { setEmail(event.target.value) }}
      />
      <div>
        <Button
          data-cy='saveChanges'
          variant="contained"
          onClick={() => handleSaveUserDetails(user)}
        >
          Tallenna
        </Button>
      </div>
    </div>
  )
}


export default EditUserDetails
