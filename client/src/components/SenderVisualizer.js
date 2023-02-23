import { useState } from 'react'
import { SensorChart } from './SensorChart'
import { formatData, getMeasurementParameters, getSmallSensorIds } from '../utils/senderDataHandler'

const SenderVisualizer = ({ id, logs }) => {
  /**
   * Function that shows device's visualized sensor data
   * @param {string} id device-id
   * @param {object} logs devices sensor data log
   * @returns {JSX.Element} JSX element of device's sensor charts
   */

  //React hook containing info about showing/not showing the charts
  const [detailed, setDetailed] = useState(false)

  const hideWhenDetailed = { display: detailed ? 'none' : '' }
  const showWhenDetailed = { display: detailed ? '' : 'none' }

  const measurementParameters = getMeasurementParameters(logs)

  const bigSensorIds = getSmallSensorIds(logs)
  const bigSensorData = formatData(logs, measurementParameters)

  const smallSensorIds = getSmallSensorIds(logs, true)
  const smallSensorData = formatData(logs, measurementParameters)

  const toggleDetails = () => {
    //Function that toggles the visibility of the charts
    setDetailed(!detailed)
  }

  return (
    <div className='sensor-chart-group'>
      <div style={hideWhenDetailed}>
        <p><b>{id} </b><button onClick={toggleDetails}>näytä</button></p>
      </div>
      <div style={showWhenDetailed}>
        <p><b>Laite-ID {id}:n logit </b> <button onClick={toggleDetails}>piilota</button></p>
        {measurementParameters.filter(parameter => parameter !== 'measurement').map(parameter =>
          <SensorChart id='normal-sensor-chart' key={parameter} parameter={parameter} ids={bigSensorIds} logs={bigSensorData} />
        )}
        <SensorChart id='small-sensor-chart' parameter='measurement' ids={smallSensorIds} logs={smallSensorData} />
      </div>
    </div>
  )
}


export default SenderVisualizer