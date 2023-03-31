import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const COLORS = ['blue', 'crimson', 'green', 'purple', 'black']

//Enum of Finnish translations of measurement parameters
const TRANSLATE = {
  temperature: 'Lämpötila',
  humidity: 'Ilmankosteus',
  pressure: 'Ilmanpaine',
  measurement: 'Mittaus',
}
Object.freeze(TRANSLATE)

/**
 * Creates a chart of specified measurement parameter from all sensors of one sender device
 * @param {string} parameter - Measurement paramenter to be made a chart of
 * @param {Array.<string>} ids - Array of sensor ids
 * @param {Array.<Object>} logs - Array of measurement logs
 * @returns {JSX.Element} JSX element of chart of a measurement
 */
const SensorChart = ({ parameter, ids, logs }) => {

  // Creates a linechart of a measurement and maps all sensors as different lines
  return (
    <div>
      <p><b>{ TRANSLATE[parameter] }</b></p>
      <LineChart
        width={600}
        height={300}
        data={logs}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey="date" />
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
    </div>
  )
}


export { SensorChart }