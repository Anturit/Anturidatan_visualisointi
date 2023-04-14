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
import { getWeek, intlFormat } from 'date-fns'
import senderService from '../services/senderService'

export default function TimePeriodMenu(
  { selectedSenderId, visibleSenders, setVisibleSenders }
) {
  const [senders, setSenders] = useState([])
  const [sliderValue, setSliderValue] = useState(4)
  const [selectedDate, setSelectedDate] = useState(new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0, 0, 0, 0
  ))
  const [matchingRegion, setMatchingRegion] = useState({
    first:0, last:0
  })

  /**
   * Format date to finnish intl format, example: to 30.3.2023
   * @param {date} date
   * @returns {string} - Weekday date format
   */
  const getWeekdayFormat = (date) => {
    const dayLabel = intlFormat(date, {
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }, {
      locale: 'fi-FI',
    })
    return dayLabel
  }

  /**
   * Format date to show week and year, example: 13. viikko 2023
   * @param {date} date
   * @returns {string} - date in week and year
   */
  const getWeekFormat = (date) => {
    const year = date.getFullYear()
    const week = getWeek(date)
    return `${week}. viikko ${year}`
  }

  /**
   * Format date to show month and year, example: maaliskuu 2023
   * @param {date} date
   * @returns {string} - date in month and year
   */
  const getMonthFormat = (date) => {
    const monthLabel = intlFormat(date, {
      year: 'numeric',
      month: 'long',
    }, {
      locale: 'fi-FI',
    })
    return monthLabel
  }

  /**
   * Returns date label in finnish
   * @param {date} date
   * @returns {string} - date label
   */
  const getDateLabel = (date) => {
    if (sliderValue === 1) { return getWeekdayFormat(date) }
    if (sliderValue === 2) { return getWeekFormat(date) }
    if (sliderValue === 3) { return getMonthFormat(date) }
    if (sliderValue === 4) { return date.getFullYear() }
  }

  const senderLogMatcher = (senderDate) => {
    const sameDay = senderDate.getDay() === selectedDate.getDay()
    const sameWeek = getWeek(senderDate) === getWeek(selectedDate)
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
   * modify selected date to last date in the sender log array
   * @param {string} id
   */
  const fetchSenderById = async (id) => {
    const selectedYear = selectedDate.getFullYear()
    try {
      const data = await senderService.getOneSenderLogsFromYear(id, selectedYear)
      if (data && data.length > 0) {
        setSenders(data)
        setSelectedDate(new Date(data[data.length-1].date))
      } else {
        setSenders([])
        setSelectedDate(new Date(selectedYear, 0, 1))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchSenderById(selectedSenderId)
  }, [selectedSenderId, selectedDate.getFullYear()])

  useEffect(() => {
    const [first, last] = findMatchingRegion(senders)
    setMatchingRegion({ first, last })
    const filteredSenders = senders.slice(first, last + 1)
    setVisibleSenders(filteredSenders)
  }, [selectedSenderId, sliderValue, selectedDate])

  const canIncreaseDate = (sliderValue === 4 && selectedDate.getFullYear() < new Date().getFullYear()) || ( senders.length > 0 && visibleSenders.length > 0 && matchingRegion.last !== senders.length - 1)
  const canDecreaseDate = sliderValue === 4 || ( senders.length > 0 && visibleSenders.length > 0 && matchingRegion.first !== 0 )

  const increaseDate = () => {
    const currentYear = new Date().getFullYear()
    const nextYear= new Date()
    nextYear.setFullYear(selectedDate.getFullYear() + 1)
    sliderValue !== 4
      ? setSelectedDate(new Date(senders[matchingRegion.last + 1].date))
      : nextYear.getFullYear() <= currentYear
        ? setSelectedDate(nextYear)
        : setSelectedDate(selectedDate)
  }

  const decreaseDate = () => {
    const lastYear= new Date()
    lastYear.setFullYear(selectedDate.getFullYear() - 1)
    sliderValue === 4
      ? setSelectedDate(lastYear)
      : setSelectedDate(new Date(senders[matchingRegion.first - 1].date))
  }

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
        && decreaseDate()}
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
        && increaseDate()}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Stack>
    <Slider
      data-cy='time-select-slider'
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