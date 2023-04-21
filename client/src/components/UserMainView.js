import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Container, Stack, Typography } from '@mui/material'
import SenderDropdown from './SenderDropdown'
import SenderList from './SenderList'
import TimePeriodMenu from './TimePeriodMenu'

/**
 * @typedef {import('../services/userService').userObject} userObject
*/

const UserMainView = () => {
  /**
   * Renders user details from user object imported from Redux store.
   * @const
   * @type {userObject}
  */
  const user = useSelector((state) => state.loginForm.user)
  const [selectedSenderId, setSelectedSenderId] = useState(user.senderDeviceIds[0])
  const [visibleSenders, setVisibleSenders] = useState([])
  if (user.senderDeviceIds.length === 0)
    return <Typography>
      Sinulla ei ole vielä yhtään lähetintä.
    </Typography>
  return (
    <Stack
      justifyContent="flex-start"
      alignItems="stretch"
    >
      <Container maxWidth='md'>

        {user.senderDeviceIds.length > 1 &&
      <SenderDropdown
        senderDeviceIds={user.senderDeviceIds}
        setSelectedSenderId={setSelectedSenderId}
      />
        }
        <TimePeriodMenu
          key={selectedSenderId}
          selectedSenderId={selectedSenderId}
          visibleSenders={visibleSenders}
          setVisibleSenders={setVisibleSenders}
        />
      </Container>
      <Container maxWidth='xl'>
        <SenderList senders={visibleSenders} />
      </Container>
    </Stack>
  )
}

export default UserMainView