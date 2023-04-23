import { useSelector } from 'react-redux'
import { Done, ErrorOutline } from '@mui/icons-material'
import {
  Stack,
  Typography,
  Collapse,
  Paper
} from '@mui/material'
import {
  useRef,
  useEffect
} from 'react'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  const previousNotification = useRef(notification.message)

  // update previousNotification Ref when notification changes
  useEffect(() => {
    previousNotification.current = notification
  },[notification])

  const NotificationPaper = (message, type) =>
    <Paper sx={{
      margin: 1,
      elevation: 5,
      padding: 1,
      borderBottom: 2,
      borderColor: type === 'alert' ? 'error.main' : 'success.main'
    }}>
      <Stack direction="row" alignItems="center" gap={1}>

        {type === 'alert'
          ? <ErrorOutline color={'error'}/>
          : <Done color='success'/>
        }
        <Typography variant="body1">{message}</Typography>
      </Stack>
    </Paper>

  return (
    <Collapse
      in={notification.message !== ''}
      timeout={{
        enter: 500,
        exit: 1000
      }}
    >
      {notification.message
        ? NotificationPaper(notification.message, notification.type)
        : NotificationPaper(previousNotification.current.message, previousNotification.current.type)
      }
    </Collapse>
  )
}

export default Notification