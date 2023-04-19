/* eslint-disable quotes */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Typography } from '@mui/material'
import {
  format,
  startOfDay,
  endOfDay,
  addHours,
  addDays,
  addMonths,
  getDaysInMonth,
  startOfWeek,
  startOfISOWeek,
  endOfISOWeek,
  startOfMonth,
  getMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameDay,
  isSameISOWeek,
  isSameMonth
} from 'date-fns'
const COLORS = ['blue', 'crimson', 'green', 'purple', 'black']

//Enum of Finnish translations of measurement parameters
const TRANSLATE = {
  temperature: 'Lämpötila',
  humidity: 'Ilmankosteus',
  pressure: 'Ilmanpaine',
  measurement: 'Mittaus',
}
Object.freeze(TRANSLATE)

const SCALE = {
  day: 1,
  week: 2,
  month: 3,
  year: 4,
}
Object.freeze(SCALE)

/**
 * SensorChart's Xaxis ticks according to current scale
 * @param {object} logsWithDates
 * @param {number} scale
 * @returns {array} ticks as milliseconds (24 ticks if day, 7 if week etc.)
 */
const getTicks = (logsWithDates, scale) => {
  const first = logsWithDates[0].date
  const start = {
    [SCALE.day]: startOfDay(first),
    [SCALE.week]: startOfWeek(first, { weekStartsOn : 1 }),
    [SCALE.month]: startOfMonth(first),
    [SCALE.year]: startOfYear(first),
  }[scale]
  let arr = []
  switch(scale) {
  case SCALE.day:
    arr = Array.from({ length: 25 }, (_, i) => addHours(start, i))
    break
  case SCALE.week:
    arr = Array.from({ length: 7 }, (_, i) => addDays(start, i))
    break
  case SCALE.month:
    arr = Array.from({ length: getDaysInMonth(start) }, (_, i) => addDays(start, i))
    break
  default:
    arr = Array.from({ length: 12 }, (_, i) => addMonths(start, i))
  }
  return arr.map((date) => date.getTime())
}

/**
 * Reformats the tick to readable form according to current scale
 * @param {number} tick as milliseconds
 * @param {number} scale
 * @returns {string} hour if day, day if week/month, month in finnish if year
 */
const tickFormatter = (tick, scale) => {
  if (scale === SCALE.day)
    return format(new Date(tick), 'HH:mm')
  if (scale === SCALE.week || scale === SCALE.month)
    return format(new Date(tick), 'd.M.')
  const monthsInFinnish = ['tam', 'hel', 'maa', 'huh', 'tou', 'kes', 'hei', 'elo', 'syy', 'lok', 'mar', 'jou']
  return monthsInFinnish[
    getMonth(new Date(tick))
  ]
}

/**
 * SensorChart's domain according to current scale
 * @param {object} logsWithDates
 * @param {number} scale
 * @returns {array} domain (start and end point as milliseconds)
 */
const domain = (logsWithDates, scale) => {
  const start = logsWithDates[0].date
  const getDateDomain = () => {
    if (scale === SCALE.day)
      return [startOfDay(start), endOfDay(start)]
    if (scale === SCALE.week)
      return [startOfISOWeek(start), endOfISOWeek(start)]
    if (scale === SCALE.month) {
      return [startOfMonth(start), endOfMonth(start)]
    }
    return [startOfYear(start), endOfYear(start)]
  }
  return getDateDomain()
    .map(date => date.getTime())
}

/**
 * Counts the difference of data start and end point
 * and returns accordingly whether a day, week, month or year is currently shown
 * @param {object} logsWithDates
 * @returns {number} 1 if day, 2 if week, 3 if month, 4 if year
 */
const getScale = (logsWithDates) => {
  const start = logsWithDates[0].date
  const end = logsWithDates[logsWithDates.length - 1].date
  if (isSameDay(end, start)) return SCALE.day
  if (isSameISOWeek(end, start)) return SCALE.week
  if (isSameMonth(end, start)) return SCALE.month
  return SCALE.year
}

/**
 * Creates a chart of specified measurement parameter from all sensors of one sender device
 * @param {string} parameter - Measurement paramenter to be made a chart of
 * @param {Array.<string>} ids - Array of sensor ids
 * @param {Array.<Object>} logs - Array of measurement logs
 * @returns {JSX.Element} JSX element of chart of a measurement
 */
const SensorChart = ({ parameter, ids, logs }) => {
  // Creates a linechart of a measurement and maps all sensors as different lines
  const logsWithDates = logs.map((log) => ({
    ...log,
    date: new Date(log.date),
  }))
  const scale = getScale(logsWithDates)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography variant="h6">{TRANSLATE[parameter]}</Typography>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={logsWithDates}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            dataKey='date'
            type='number'
            domain={domain(logsWithDates, scale)}
            ticks={getTicks(logsWithDates, scale)}
            tickFormatter={(tick) => tickFormatter(tick, scale)}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {ids
            .map((id, i) =>
              <Line
                key={id}
                connectNulls
                type="monotone"
                dataKey={`${id}_${parameter}`}
                stroke={COLORS[i]}
                dot={false}
                name={id}
              />
            )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


export { SensorChart }