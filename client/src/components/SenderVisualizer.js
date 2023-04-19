import { Typography } from '@mui/material'
import { SensorChart } from './SensorChart'
import { formatData, getMeasurementParameters, getSmallSensorIds } from '../utils/senderDataHandler'

/**
 * Function that shows device's visualized sensor data
 * @param {string} id device-id
 * @param {Array.<Object>} logs sensor data logs of sensor
 * @returns {JSX.Element} JSX element of device's sensor charts
 */
const SenderVisualizer = ({ id, logs }) => {

  const measurementParameters = getMeasurementParameters(logs)

  const bigSensorIds = getSmallSensorIds(logs, false)
  const smallSensorIds = getSmallSensorIds(logs, true)

  const sensorData = formatData(logs, measurementParameters)

  return (
    <div className='sensor-chart-group'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
      <Typography variant="h6">{ id }</Typography>
      <div style={{ flexGrow: 1, width: '100%' }}>
        {measurementParameters.filter(parameter => parameter !== 'measurement').map(parameter =>
          <SensorChart id={`normal-sensor-chart-${parameter}`} key={parameter} parameter={parameter} ids={bigSensorIds} logs={sensorData} />
        )}
        <SensorChart id='small-sensor-chart' parameter='measurement' ids={smallSensorIds} logs={sensorData} />
      </div>
    </div>
  )
}


export default SenderVisualizer