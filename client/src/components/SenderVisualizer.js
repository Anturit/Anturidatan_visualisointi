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
    <div className='sensor-chart-group'>
      <div>
        <p><b>{id}</b></p>
      </div>
      <div>
        {measurementParameters.filter(parameter => parameter !== 'measurement').map(parameter =>
          <SensorChart id='normal-sensor-chart' key={parameter} parameter={parameter} ids={bigSensorIds} logs={sensorData} />
        )}
        <SensorChart id='small-sensor-chart' parameter='measurement' ids={smallSensorIds} logs={sensorData} />
      </div>
    </div>
  )
}


export default SenderVisualizer