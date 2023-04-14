import {
  IconButton,
  Slider,
  Stack,
  Typography
} from '@mui/material'
import {
  getISOWeek,
  isSameDay,
  isSameISOWeek,
  isSameMonth,
  isSameYear
} from 'date-fns'
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
  const [sliderValue, setSliderValue] = useState(1)
  const [selectedDate, setSelectedDate] = useState(new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0, 0, 0, 0
  ))
  const [matchingRegion, setMathingRegion] = useState({
    first:0, last:0
  })
  const SCALE = {
    day: 1,
    week: 2,
    month: 3,
    year: 4,
  }
  Object.freeze(SCALE)

  /**
   * Returns date label in finnish
   * @param {date} date
   * @returns {string} - date label
   */
  const getDateLabel = (date) => {
    const dayOfMonth = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const week = getISOWeek(date)
    const dayOfWeek = date.getDay()
    const dayNames = [ 'sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai',]
    const monthNames = ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu']
    const dateLabel = {
      [SCALE.day]:   `${dayNames[dayOfWeek]} ${dayOfMonth}.${month}.${year}`,
      [SCALE.week]:  `${week}. viikko ${year}`,
      [SCALE.month]: `${monthNames[month - 1]} ${year}`,
      [SCALE.year]:  `${year}`
    }
    return dateLabel[sliderValue]
  }

  const senderLogMatcher = (senderDate) => {
    return {
      [SCALE.day]:   isSameDay(senderDate, selectedDate),
      [SCALE.week]:  isSameISOWeek(senderDate, selectedDate),
      [SCALE.month]: isSameMonth(senderDate, selectedDate),
      [SCALE.year]:  isSameYear(senderDate, selectedDate)
    }[sliderValue]
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