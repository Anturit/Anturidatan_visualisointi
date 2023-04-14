import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setUsers } from '../reducers/usersReducer'
import userService from '../services/userService'
import { useState } from 'react'

const EditUserExpirationDate = ({ user, onClose }) => {
  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()
  const [expirationDate, setExpirationDate] = useState(user.expirationDate)

  const handleSaveUserExpirationDate = async (user) => {
    try {
      const updatedUser = await userService.updateUserExpirationDate(user.id, expirationDate)
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      dispatch(setUsers(updatedUsers))
      dispatch(setNotification(`Käyttäjän ${user.firstName} vanhentumispäivä päivitetty`, 3500, 'success'))
      onClose()
    } catch (err) {
      if (err.response.data.error === 'expiration date must be given') {
        dispatch(setNotification('Vanhentumispäivä puuttuu', 3500, 'alert'))
      }
    }
  }

  return (
    <div>
      <Typography variant="h6" component="h2">
        Muokkaa käyttäjän {user.firstName} lisenssin vanhentumispäivää
      </Typography>
      <Typography sx={{ mt: 2 }}>
        <TextField
          id="date"
          label="Vanhentumispäivä"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => { setExpirationDate(event.target.value) }}
        />
      </Typography>
      <Button
        variant="contained"
        onClick={() => handleSaveUserExpirationDate(user)}
      >
            Tallenna
      </Button>
    </div>
  )
}


export default EditUserExpirationDate
