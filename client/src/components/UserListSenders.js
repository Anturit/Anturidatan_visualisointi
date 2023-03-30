import { Box , IconButton } from '@mui/material'
import Typography from '@mui/material/Typography'
import { Delete } from '@mui/icons-material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 5,
}

const UserListSenders = (row) => {
  console.log(row)
  return (
    <>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Käyttäjän {row.row.firstName} anturit
        </Typography>
        <Typography sx={{ mt: 2 }}>
          {
            row.row.senderDeviceIds.map((senderDeviceId, index) => (
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
      </Box>
    </>
  )
}

export default UserListSenders