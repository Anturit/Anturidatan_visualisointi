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
 * @description Modal for editing user expiration date
 */
const EditUserExpirationDate = ({ user, onClose }) => {

  const style = {
    paddingBottom: 2,
  }

  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()
  const [expirationDate, setExpirationDate] = useState()

  /**
   * @param {Object} user
   * @returns {Promise<void>}
   * @description Handles saving user expiration date
  */
  const handleSaveUserExpirationDate = async (user) => {
    try {
      console.log(expirationDate)
      const updatedUser = await userService.updateUserExpirationDate(user.id, expirationDate)
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      dispatch(setUsers(updatedUsers))
      dispatch(setNotification(`Käyttäjän ${user.firstName} vanhentumispäivä päivitetty`, 3500, 'success'))
      onClose()
    } catch (err) {
      if (err.response.data.error === 'new expiration date must be given') {
        dispatch(setNotification('Päivämäärä puuttui. Päivämäärää ei muutettu.', 3500, 'alert'))
        onClose()
      }
    }
  }

  return (
    <div>
      <Typography variant="h6" component="h2" sx={style}>
        Muokkaa käyttäjän {user.firstName} lisenssin vanhentumispäivää
      </Typography>
      <div>
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
      </div>
      <div>
        <Button
          data-cy='saveExpirationDate'
          variant="contained"
          onClick={() => handleSaveUserExpirationDate(user)}
        >
              Tallenna
        </Button>
      </div>
    </div>
  )
}


export default EditUserExpirationDate
