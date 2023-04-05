import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Box, Typography } from '@mui/material'
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

  return (user.senderDeviceIds.length === 0
    ? <Typography>
        Sinulla ei ole vielä yhtään lähetintä.
    </Typography>
    : <>
      <Box maxWidth="sm" p={2}>
        {user.senderDeviceIds.length > 1 &&
          <SenderDropdown
            senderDeviceIds={user.senderDeviceIds}
            setSelectedSenderId={setSelectedSenderId}
          />
        }
        <TimePeriodMenu
          selectedSenderId={selectedSenderId}
          setVisibleSenders={setVisibleSenders}
        />
        <SenderList senders={visibleSenders} />
      </Box>
    </>
  )
}

export default UserMainView