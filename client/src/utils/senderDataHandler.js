
import { format, parseISO, roundToNearestMinutes } from 'date-fns'
import { groupBy, chain, spread, assign } from 'lodash'

// Object keys-values that are filtered out from formatted data
const SUPPRESS = ['id', 'sen_id',  'date', 'seq_number', 'device', 'sen_battery', 'dev_battery']

const groupByDeviceID = (senders) => {
  return groupBy(senders, 'device')
}

const combineObjectsByDate = (logs) => {
  /**
   * Create a new array of Objects, where data with same timestamp are contained in same Object
   * @param {Object[]} logs - Array of measurement logs
   * @returns {Object[]} Array of measurement logs, where logs with same timestamp are in same object
   */

  const formattedData =
    chain(logs)
      .groupBy('date')
      .map(spread(assign))
      .value()

  return formattedData
}


const combineSensorIdAndMeasurementParameter = ( logs, measurementParameters ) => {
  /**
   * Create a new array of Objects, where:
   * datetime microsecond values are truncated off,
   * sensor_id and measurement parameter object keys are combined as single keys and measurement value stays as a value eg.
   * "sen_id": 6a and "temperature": 28.0 => "6a_temperature": 28.0
   * "sen_id": 6a and "pressure": 12000.0 => "6a_pressure": 12000.0
   * @param {Object[]} logs - Array of measurement logs
   * @param {string[]} measurementParameters - Array of parameters that were measured
   * @returns {Object[]} Array of measurement logs, where sensor id and measurement parameter are combined as new keys
   */

  const formattedData = logs
    // Sorts data by ascending date
    .sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    .map((obj) => {
      const dataPoint = {}
      dataPoint['date'] = format(roundToNearestMinutes(parseISO(obj['date']), { nearestTo: 1 }), 'HH:mm dd-MM-yyyy')

      // If measurement has a value maps new Object keys from sensor ids and measurement parameter and assigns measurement value
      for (const parameter of measurementParameters) {
        if (obj[parameter] !== undefined) {
          dataPoint[`${obj['sen_id']}_${parameter}`] = obj[parameter]
        }
      }

      return dataPoint
    })

  return formattedData
}

// Get unique list of Object keys of measurement parametres that are not filtered out by SUPPRESS
const getMeasurementParameters = (logs) =>  {
  return [ ...new Set(logs.flatMap(Object.keys).filter(item => !SUPPRESS.includes(item))) ]
}

const getSmallSensorIds = (logs, smallSensor = false) => {
  /**
   * Function to get unique list of sensor ids of specified sensor type
   * Big sensor = contains measurements of temperature, humidity etc..
   * Small sensor = contains only one measurement parameter
   * @param {Object[]} logs - Array of measurement logs
   * @param {boolean} smallSensor - Specify sensor type, true if small sensor
   * @returns {string[]} Array of unique ids of specified sensor type
   */
  return [ ...new Set( logs
    .filter(sensor => smallSensor ? sensor['measurement'] : !sensor['measurement'])
    .map(obj => obj['sen_id']))
  ]
}

const formatData = (logs, measurementParameters) => {
  return (
    combineObjectsByDate(
      combineSensorIdAndMeasurementParameter(
        logs,
        measurementParameters
      )))
}

export {
  formatData,
  groupByDeviceID,
  getMeasurementParameters,
  getSmallSensorIds,
}