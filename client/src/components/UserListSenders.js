import { IconButton } from '@mui/material'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { Delete } from '@mui/icons-material'
import TextField from '@mui/material/TextField'
import { useDispatch } from 'react-redux'
import { deleteUserDevice, getUserDevices } from '../reducers/usersReducer'

const UserListSenders = ({ user }) => {
  const [senderId, SetsenderdId] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = (event) => {
    event.preventDefault()
    SetsenderdId(event.target.value)
    console.log(senderId)
  }

  const handleDeleteDevice = (index) => {
    try {
      console.log(user.senderDeviceIds, 'not done')
      dispatch(deleteUserDevice(user.id, user.senderDeviceIds[index]))
      dispatch(getUserDevices(user.id))
      console.log(user.senderDeviceIds, 'done')
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <Typography variant="h6" component="h2">
          Käyttäjän {user.firstName}
      </Typography>
      <Typography sx={{ mt: 2 }}>
        {user.senderDeviceIds.map((senderDeviceId, index) => (
          <li key={index}>
            {senderDeviceId}
            <IconButton onClick={() => handleDeleteDevice(index)}>
              <Delete />
            </IconButton>
          </li>
        ))}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Lisää lähetin" onChange={({ target }) => SetsenderdId(target.value)} />
      </form>
    </>
  )
}

export default UserListSenders
