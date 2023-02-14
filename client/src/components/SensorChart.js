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

const TRANSLATE = {
  temperature: 'Lämpötila',
  humidity: 'Ilmankosteus',
  pressure: 'Ilmanpaine',
  measurement: 'Mittaus',
}
Object.freeze(TRANSLATE)

const SensorChart = ({ parameter, ids, logs }) => {

  if (logs.length === 0) {
    return
  }

  return (
    <div>
      <p><b>{ TRANSLATE[parameter] }</b></p>
      <LineChart
        width={500}
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