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
  const allSensorIds = bigSensorIds.concat(smallSensorIds)

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
        {measurementParameters.filter(parameter => !['measurement', 'dev_battery', 'sen_battery'].includes(parameter)).map(parameter =>
          <SensorChart id={`normal-sensor-chart-${parameter}`} key={parameter} parameter={parameter} ids={bigSensorIds} logs={sensorData} />
        )}
        {measurementParameters.includes('measurement') && <SensorChart id='small-sensor-chart' parameter='measurement' ids={smallSensorIds} logs={sensorData} />}
        <div>
          <SensorChart id={'battery-sensor-chart-dev-battery'} parameter={'dev_battery'} ids={allSensorIds} logs={sensorData} />
          <SensorChart id={'battery-sensor-chart-sen-battery'} parameter={'sen_battery'} ids={allSensorIds} logs={sensorData} />
        </div>
      </div>
    </div>
  )
}


export default SenderVisualizer