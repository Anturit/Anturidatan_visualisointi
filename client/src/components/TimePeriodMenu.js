import {
  IconButton,
  Slider,
  Stack,
  Typography
} from '@mui/material'
import {
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import senderService from '../services/senderService'

export default function TimePeriodMenu(
  { selectedSenderId, setVisibleSenders }
) {
  const [senders, setSenders] = useState([])
  const [sliderValue, setSliderValue] = useState(4)
  const [selectedDate, setSelectedDate] = useState(new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0, 0, 0, 0
  ))
  const [matchingRegion, setMathingRegion] = useState({
    first:0, last:0
  })

  /**
   * Returns week number of given date
   * returns 0 if date is in last week of the previous year
   * returns 1 if date is in first full week of the year
   * returns 52 or 53 if date is in last week of the year
   * @param {Date} date
   * @returns {number} week number
   */
  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1)
    var days = Math.floor((date - startDate) /
        (24 * 60 * 60 * 1000))

    return Math.ceil(days / 7)
  }


  /**
   * Returns date label in finnish
   * @param {date} date
   * @returns {string} - date label
   */
  const getDateLabel = (date) => {
    const dayOfMonth = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const week = getWeekNumber(date)
    const dayOfWeek = date.getDay()
    const dayNames = [ 'sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai',]
    const monthNames = ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu']
    const dateLabel = {
      1: `${dayNames[dayOfWeek]} ${dayOfMonth}.${month}.${year}`,
      2: `${week}. viikko ${year}`,
      3: `${monthNames[month - 1]} ${year}`,
      4: `${year}`
    }
    return dateLabel[sliderValue]
  }

  const senderLogMatcher = (senderDate) => {
    const sameDay = senderDate.getDay() === selectedDate.getDay()
    const sameWeek = getWeekNumber(senderDate) === getWeekNumber(selectedDate)
    const sameMonth = senderDate.getMonth() === selectedDate.getMonth()
    const sameYear = senderDate.getFullYear() === selectedDate.getFullYear()
    if ( !sameYear ) return false
    if ( sliderValue <= 3 && !sameMonth) return false
    if ( sliderValue <= 2 && !sameWeek) return false
    if ( sliderValue <= 1 && !sameDay) return false
    return true
  }
  const findMatchingRegion = (senders) => {
    if (senders.length === 0) return senders
    const first = senders.findIndex(sender => senderLogMatcher(new Date(sender.date)))
    const last = senders.findLastIndex(sender => senderLogMatcher(new Date(sender.date)))
    return [first, last]
  }

  /**
   * Fetch sender logs by id
   * set sorted sender logs to state
   * modify selected date to last date in the sender log array
   * @param {string} id
   */
  const fetchSenderById = async (id) => {
    const data = await senderService.getOneSenderLogs(id)
    const dataByDateAscending = data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setSenders(dataByDateAscending)
    setSelectedDate(
      new Date(dataByDateAscending[dataByDateAscending.length-1].date)
    )
  }

  useEffect(() => {
    fetchSenderById(selectedSenderId)
  }, [selectedSenderId])

  useEffect(() => {
    const [first, last] = findMatchingRegion(senders)
    setMathingRegion({ first, last })
    const filteredSenders = senders.slice(first, last + 1)
    setVisibleSenders(filteredSenders)
  }, [selectedSenderId, sliderValue, selectedDate])

  const canIncreaseDate = senders.length > 0 && matchingRegion.last !== senders.length - 1
  const canDecreaseDate = senders.length > 0 && matchingRegion.first !== 0
  return <>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <IconButton
        data-cy={'left-arrow-button'}
        color={canDecreaseDate ? 'primary' : 'disabled'}
        onClick={() =>
          canDecreaseDate
        && setSelectedDate(new Date(senders[matchingRegion.first - 1].date))}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <Typography>
        {getDateLabel(selectedDate)}
      </Typography>
      <IconButton
        data-cy={'right-arrow-button'}
        color={canIncreaseDate ? 'primary' : 'disabled'}
        onClick={() =>
          canIncreaseDate
        && setSelectedDate(new Date(senders[matchingRegion.last + 1].date))}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Stack>
    <Slider
      value={sliderValue}
      min={1}
      step={1}
      max={4}
      marks={[
        { value: 1, label: 'päivä' },
        { value: 2, label: 'viikko' },
        { value: 3, label: 'kuukausi' },
        { value: 4, label: 'vuosi' }
      ]}
      track={false}
      onChange={(event, newValue) => {
        if (typeof newValue === 'number') setSliderValue(newValue)
      }}
    />
  </>
}