import {
  IconButton,
  Slider,
  Stack
} from '@mui/material'
import {
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material'

export default function TimePeriodMenu(
  { senders, visibleSenders, sliderValue, setSliderValue, selectedDate, setSelectedDate }
) {
  const marks = [
    { value: 1, label: 'päivä' },
    { value: 2, label: 'viikko' },
    { value: 3, label: 'kuukausi' },
    { value: 4, label: 'vuosi' }
  ]
  const getCurrentWeek = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1)
    var days = Math.floor((date - startDate) /
        (24 * 60 * 60 * 1000))

    return Math.ceil(days / 7)
  }
  const handleSliderChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setSliderValue(newValue)
    }
  }
  const getChangeDate = (shouldIncrease = false) => {
    const sign = shouldIncrease ? 1 : -1
    const newDate = {
      1: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + 1 * sign
      ),
      2: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() - selectedDate.getDay()  + 7 * sign
      ),
      3: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1 * sign,
        selectedDate.getDate()
      ),
      4: new Date(
        selectedDate.getFullYear() + 1 * sign,
        selectedDate.getMonth(),
        selectedDate.getDate()
      ),
    }
    const newDateValue = newDate[sliderValue]
    return newDateValue
  }
  const selectedDateLabel = () => {
    const date = selectedDate.getDate()
    const month = selectedDate.getMonth() + 1
    const year = selectedDate.getFullYear()
    const week = getCurrentWeek(selectedDate)
    const day = selectedDate.getDay()
    const dayNames = [ 'sunnuntai', 'maanantai', 'tiistai', 'keskiviikko', 'torstai', 'perjantai', 'lauantai',]
    const monthNames = ['tammikuu', 'helmikuu', 'maaliskuu', 'huhtikuu', 'toukokuu', 'kesäkuu', 'heinäkuu', 'elokuu', 'syyskuu', 'lokakuu', 'marraskuu', 'joulukuu']
    const dateLabel = {
      1: `${dayNames[day]} ${date}.${month}.${year}`,
      2: `${week}. viikko ${year}`,
      3: `${monthNames[month - 1]} ${year}`,
      4: `${year}`
    }
    return dateLabel[sliderValue]
  }
  const canIncreaseDate = senders.length > 0 && visibleSenders.length > 0
    && new Date(visibleSenders[visibleSenders.length - 1].date) < new Date(senders[senders.length - 1].date)
  const canDecreaseDate = senders.length > 0 && visibleSenders.length > 0
    && new Date(visibleSenders[0].date) > new Date(senders[0].date)
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
        && setSelectedDate(getChangeDate())}
      >
        <KeyboardArrowLeft />
      </IconButton>
      {selectedDateLabel()}
      <IconButton
        data-cy={'right-arrow-button'}
        color={canIncreaseDate ? 'primary' : 'disabled'}
        onClick={() =>
          canIncreaseDate
        && setSelectedDate(getChangeDate(true))}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Stack>
    <Slider
      value={sliderValue}
      min={1}
      step={1}
      max={4}
      marks={marks}
      track={false}
      onChange={handleSliderChange}
    />
  </>
}