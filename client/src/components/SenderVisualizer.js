import { SensorChart } from './SensorChart'
import { formatData, getMeasurementParameters, getSmallSensorIds } from '../utils/senderDataHandler'

const SenderVisualizer = ({ id, logs }) => {
  /**
   * Function that shows device's visualized sensor data
   * @param {string} id device-id
   * @param {object} logs devices sensor data log
   * @returns {JSX.Element} JSX element of device's sensor charts
   */

  const measurementParameters = getMeasurementParameters(logs)

  const bigSensorIds = getSmallSensorIds(logs)
  const bigSensorData = formatData(logs, measurementParameters)

  const smallSensorIds = getSmallSensorIds(logs, true)
  const smallSensorData = formatData(logs, measurementParameters)

  return (
    <div className='sensor-chart-group'>
      <div>
        <p><b>{id}</b></p>
      </div>
      <div>
        {measurementParameters.filter(parameter => parameter !== 'measurement').map(parameter =>
          <SensorChart id='normal-sensor-chart' key={parameter} parameter={parameter} ids={bigSensorIds} logs={bigSensorData} />
        )}
        <SensorChart id='small-sensor-chart' parameter='measurement' ids={smallSensorIds} logs={smallSensorData} />
      </div>
    </div>
  )
}


export default SenderVisualizer