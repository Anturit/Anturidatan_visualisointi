import { useSelector } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Slider
} from '@mui/material'
import SenderDropdown from './SenderDropdown'
import SenderList from './SenderList'
import senderService from '../services/senderService'

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

  const [senders, setSenders] = useState([])
  const [sliderValue, setSliderValue] = useState(4)

  const filterSenders = (senders, sliderValue) => {
    if (sliderValue === 4) return senders

    const sortedSenders = senders
      .sort((a,b) => new Date(a.date) - new Date(b.date))
    const lastSender = sortedSenders[senders.length - 1]
    const decreaseValue = {
      1: 24*60*60*1000, // 1 day in milliseconds
      2: 7*24*60*60*1000, // 1 week in milliseconds
      3: 31*7*24*60*60*1000, // 1 month in milliseconds
    }
    const timeToCompare = (new Date(lastSender.date)).getTime() - decreaseValue[sliderValue]
    return sortedSenders
      .filter(
        (sender) => (timeToCompare) < (new Date(sender.date)).getTime()
      )
  }
  const visibleSenders = useMemo(
    () => filterSenders(senders, sliderValue),
    [senders, sliderValue]
  )
  // Convert expirationDate to Finnish locale date format
  //const expirationDate = new Date(user.expirationDate).toLocaleDateString('fi-FI')

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   */
  useEffect(() => {
    if (user) {
      const fetchSenderData = async () => {
        const data = await senderService.getOneSenderLogs(
          user.senderDeviceIds[0]
        )
        setSenders(data)
      }
      fetchSenderData()
    }
  }, [user])

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   * @param {string} id
   * @param {string} token
   * @returns {Object} sender
   */
  const fetchSenderById = async (id) => {
    const sender = await senderService.getOneSenderLogs(id)
    setSenders(sender)
  }
  const label = (value) => ({
    1: 'päivä',
    2: 'viikko',
    3: 'kuukausi',
    4: 'koko aika'
  }[value])

  const handleSliderChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setSliderValue(newValue)
    }
  }

  return (
    <>
      <Box maxWidth="sm">
        {user.senderDeviceIds.length > 1 &&
        <SenderDropdown
          senderDeviceIds={user.senderDeviceIds}
          fetchSenderById={fetchSenderById}
        />
        }
        <Slider
          value={sliderValue}
          min={1}
          step={1}
          max={4}
          track={false}
          getAriaValueText={label}
          valueLabelFormat={label}
          valueLabelDisplay="on"
          onChange={handleSliderChange}
        />
        <SenderList senders={visibleSenders} />
      </Box>
    </>
  )
}

export default UserMainView