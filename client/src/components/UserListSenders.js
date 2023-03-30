import { IconButton } from '@mui/material'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { Delete } from '@mui/icons-material'
import TextField from '@mui/material/TextField'


const UserListSenders = ({ user }) => {
  const [senderId, SetsenderdId]  = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    SetsenderdId(event.target.value)
    console.log(senderId)
  }
  return (
    <>

      <Typography variant="h6" component="h2">
          Käyttäjän {user.firstName} anturit
      </Typography>
      <Typography sx={{ mt: 2 }}>
        {
          user.senderDeviceIds.map((senderDeviceId, index) => (
            <li key={index}>
              {senderDeviceId}
              <IconButton
              >
                <Delete />
              </IconButton>
            </li>
          ))
        }
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Lisää lähetin" onChange={({ target }) => SetsenderdId(target.value)}/>
      </form>

    </>
  )
}

export default UserListSenders