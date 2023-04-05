import { useSelector } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import { Box } from '@mui/material'
import SenderDropdown from './SenderDropdown'
import SenderList from './SenderList'
import senderService from '../services/senderService'
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

  const [senders, setSenders] = useState([])
  const [sliderValue, setSliderValue] = useState(4)
  const [selectedDate, setSelectedDate] = useState(new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0, 0, 0, 0
  ))

  const getCurrentWeek = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1)
    var days = Math.floor((date - startDate) /
        (24 * 60 * 60 * 1000))

    return Math.ceil(days / 7)
  }
  const senderFilter = (senderDate) => {
    const sameDay = senderDate.getDay() === selectedDate.getDay()
    const sameWeek = getCurrentWeek(senderDate) === getCurrentWeek(selectedDate)
    const sameMonth = senderDate.getMonth() === selectedDate.getMonth()
    const sameYear = senderDate.getFullYear() === selectedDate.getFullYear()
    if ( !sameYear ) return false
    if ( sliderValue <= 3 && !sameMonth) return false
    if ( sliderValue <= 2 && !sameWeek) return false
    if ( sliderValue <= 1 && !sameDay) return false
    return true
  }
  const filterSenders = (senders) => {
    if (senders.length === 0) return senders
    return senders.filter(
      sender => senderFilter(new Date(sender.date))
    )
  }
  const visibleSenders = useMemo(
    () => filterSenders(senders),
    [senders, sliderValue, selectedDate]
  )

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   * @param {string} id
   * @param {string} token
   * @returns {Object} sender
   */
  const fetchSenderById = async (id) => {
    const data = await senderService.getOneSenderLogs(id)
    const dataByDateAscending = data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setSenders(dataByDateAscending)
    setSelectedDate(
      new Date(dataByDateAscending[dataByDateAscending.length-1].date)
    )

    console.log('last sender', dataByDateAscending[dataByDateAscending.length - 1].date)
    console.log('first sender', dataByDateAscending[0].date)
  }

  /**
   * Function to fetch sender logs for user
   * @returns sender object with all fields.
   */
  useEffect(() => {
    fetchSenderById(user.senderDeviceIds[0])
  }, [])

  return (
    <>
      <Box maxWidth="sm" p={2}>
        {user.senderDeviceIds.length > 1 &&
        <SenderDropdown
          senderDeviceIds={user.senderDeviceIds}
          fetchSenderById={fetchSenderById}
        />
        }
        <TimePeriodMenu
          senders={senders}
          visibleSenders={visibleSenders}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <SenderList senders={visibleSenders} />
      </Box>
    </>
  )
}

export default UserMainView