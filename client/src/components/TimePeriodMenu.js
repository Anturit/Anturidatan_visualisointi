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
import {
  subYears,
  addYears,
  getWeek,
  intlFormat,
  isSameDay,
  isSameISOWeek,
  isSameMonth,
  isSameYear
} from 'date-fns'
import senderService from '../services/senderService'

export default function TimePeriodMenu(
  { selectedSenderId, visibleSenders, setVisibleSenders }
) {
  const SCALE = {
    day: 1,
    week: 2,
    month: 3,
    year: 4,
  }
  const [senders, setSenders] = useState([])
  const [fetchedYears, setFetchedYears] = useState([])
  const [canFetchMore, setCanFetchMore] = useState({
    olderData: true,
    newerData: true
  })
  const [sliderValue, setSliderValue] = useState(SCALE.day)
  const [selectedDate, setSelectedDate] = useState(new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0, 0, 0, 0
  ))
  const [matchingRegion, setMatchingRegion] = useState({
    first:0, last:0
  })
  const [loadingData, setLoadingData] = useState(true)

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
    if (sliderValue === SCALE.day) { return getWeekdayFormat(date) }
    if (sliderValue === SCALE.week) { return getWeekFormat(date) }
    if (sliderValue === SCALE.month) { return getMonthFormat(date) }
    if (sliderValue === SCALE.year) { return date.getFullYear() }
  }

  /**
   * Return first and last index of matching region
   * @param {array} senders
   * @param {Date} selectedDate
   * @returns {array} - Array of first and last index
   */
  const findMatchingRegion = (senders, selectedDate) => {
    const matcher = (senderDate) =>  ({
      [SCALE.day]:   isSameDay(senderDate, selectedDate),
      [SCALE.week]:  isSameISOWeek(senderDate, selectedDate),
      [SCALE.month]: isSameMonth(senderDate, selectedDate),
      [SCALE.year]:  isSameYear(senderDate, selectedDate)
    }[sliderValue])
    const first = senders.findIndex(sender => matcher(new Date(sender.date), selectedDate))
    const last = senders.findLastIndex(sender => matcher(new Date(sender.date), selectedDate))
    return [first, last]
  }

  const handleNoDataFound = (dataIsNewer) => {
    setCanFetchMore(
      dataIsNewer
        ? { ...canFetchMore, newerData: false }
        : { ...canFetchMore, olderData: false }
    )
    const indexForDate = dataIsNewer ? senders.length - 1 : 0
    setSelectedDate(
      new Date(senders[indexForDate].date)
    )
  }

  /**
   * Fetch sender logs from specified year by id
   * @param {string} id
   * @param {number} year
   * @returns {array} - Array of sender logs
   */
  async function fetchSenderLogs(id, year) {
    try {
      const data = await senderService.getOneSenderLogsFromYear(id, year)
      return data
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  /**
   * Fetches sender logs from selected year
   * updates senders, fetchedYears, selectedDate, canFetchMore states
   * @param {number} selectedYear
   */
  const handleFetchMoreLogs = async (selectedYear) => {
    const data = await fetchSenderLogs(selectedSenderId, selectedYear)
    const dataIsNewer = fetchedYears[0] < selectedYear
    setLoadingData(false)
    if (!data || data.length === 0) {
      if (senders.length === 0) return
      handleNoDataFound(dataIsNewer)
      return
    }
    setSenders((senders) => (dataIsNewer)
      ? [...senders, ...data]
      : [...data, ...senders]
    )
    setFetchedYears((fetchedYears) => (dataIsNewer)
      ? [...fetchedYears, selectedYear]
      : [selectedYear, ...fetchedYears]
    )
    const indexForDate = dataIsNewer ? 0 : data.length - 1
    setSelectedDate(new Date(data[indexForDate].date))
  }


  useEffect(() => {
    if (!loadingData)
      return
    handleFetchMoreLogs(selectedDate.getFullYear())
  }, [selectedSenderId, loadingData, selectedDate.getFullYear()])

  useEffect(() => {
    if (senders.length === 0) return setVisibleSenders([])
    const [first, last] = findMatchingRegion(senders, selectedDate)
    setMatchingRegion({ first, last })
    const filteredSenders = senders.slice(first, last + 1)
    setVisibleSenders(filteredSenders)
  }, [selectedSenderId, senders, sliderValue, selectedDate])

  const canIncreaseDate = !loadingData && (canFetchMore.newerData || matchingRegion.last !== senders.length - 1)
  const canDecreaseDate = !loadingData && (canFetchMore.olderData || matchingRegion.first !== 0)

  const increaseDate = () => {
    if (visibleSenders.length !== 0&& matchingRegion.last !== senders.length - 1)
      setSelectedDate(new Date(senders[matchingRegion.last + 1].date))
    else {
      setLoadingData(true)
      setSelectedDate(addYears(selectedDate, 1))
    }
  }

  const decreaseDate = () => {
    if (visibleSenders.length !== 0&& matchingRegion.first !== 0)
      setSelectedDate(new Date(senders[matchingRegion.first - 1].date))
    else {
      setLoadingData(true)
      setSelectedDate(subYears(selectedDate,1))
    }
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