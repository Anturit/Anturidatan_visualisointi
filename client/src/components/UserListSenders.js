import { IconButton } from '@mui/material'
import { useState, useRef } from 'react'
import Typography from '@mui/material/Typography'
import { Delete } from '@mui/icons-material'
import TextField from '@mui/material/TextField'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setUsers } from '../reducers/usersReducer'
import userService from '../services/userService'

const UserListSenders = ({ user }) => {
  const [senderDeviceIds, setSenderDeviceIds] = useState(user.senderDeviceIds)
  const users = useSelector((state) => state.users)
  const dispatch = useDispatch()
  const textFieldRef = useRef(null)

  const handleSenderDeviceAddition = async (event) => {
    event.preventDefault()
    const senderDeviceId = textFieldRef.current.value

    try {
      const updatedUser = await userService.addSenderDevice(user.id, senderDeviceId)
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      dispatch(setUsers(updatedUsers))
      dispatch(setNotification(`Lähetin ${senderDeviceId} lisätty käyttäjälle ${user.firstName}`, 3500, 'success'))
      setSenderDeviceIds(updatedUser.senderDeviceIds)
      textFieldRef.current.value = ''

    } catch (err) {
      if (err.response.data.error === 'sender device id must be given') {
        dispatch(setNotification('Lähettimen tunnus puuttuu', 3500, 'alert'))
      }
      if (err.response.data.error === 'sender device id already added to user') {
        dispatch(setNotification(`Lähetin on jo lisätty käyttäjälle ${user.firstName}`, 3500, 'alert'))
        textFieldRef.current.value = ''
      }
    }
  }

  const handleDeleteDevice = (index) => {
    try {
      const senderDeviceId = senderDeviceIds[index]
      userService.removeSenderDevice(user.id, senderDeviceId)
      const updatedSenderDeviceIds = senderDeviceIds.filter((id, i) => i !== index)
      setSenderDeviceIds(updatedSenderDeviceIds)
      dispatch(setNotification(`Lähetin ${senderDeviceId} poistettu käyttäjältä ${user.firstName}`, 3500, 'success'))
    } catch (err) {
      if (err.response.data.error === 'sender device id not found') {
        dispatch(setNotification('Lähetintä ei löytynyt', 3500, 'alert'))
      }
      if (err.response.data.error === 'sender device id not found in user') {
        dispatch(setNotification('Lähetin ei löytynyt käyttäjältä', 3500, 'alert'))
      }
    }
  }

  return (
    <>
      <Typography variant="h6" component="h2">
          Käyttäjän {user.firstName} lähettimet
      </Typography>
      <Typography sx={{ mt: 2 }} data-cy="senderDeviceList">
        {
          senderDeviceIds.map((senderDeviceId, index) => (
            <li key={index} data-cy={`senderDevice-${index}`}>
              {senderDeviceId}
              <IconButton onClick={() => handleDeleteDevice(index)} data-cy='deleteSender'>
                <Delete />
              </IconButton>
            </li>
          ))
        }
      </Typography>

      <form onSubmit={handleSenderDeviceAddition}>
        <TextField data-cy='addSender' label="Lisää lähetin" inputRef={textFieldRef} />
      </form>
    </>
  )
}

export default UserListSenders
