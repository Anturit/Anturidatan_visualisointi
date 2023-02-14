
import { format, parseISO, roundToNearestMinutes } from 'date-fns'
import { groupBy, chain, spread, assign } from 'lodash'

// Object keys that are not to be visualized in a chart
const SUPPRESS = ['id', 'sen_id',  'date', 'seq_number', 'device', 'sen_battery', 'dev_battery']

const groupByDeviceID = (senders) => {
  return groupBy(senders, 'device')
}

// Create new array of Objects, where data with same timestamp are in same Object
const combineObjectsByDate = (logs) => {
  const formattedData =
    chain(logs)
      .groupBy('date')
      .map(spread(assign))
      .value()

  return formattedData
}


// Format data so ex. "sen_id": 6a and "temperate": 42.0 => "6a_temperature": 41.0, also format datetime
const combineSensorIdAndMeasurementParameter = ( logs, measurementParameters ) => {
  const formattedData = logs
    .sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    .map((obj) => {
      const dataPoint = {}
      dataPoint['date'] = format(roundToNearestMinutes(parseISO(obj['date']), { nearestTo: 1 }), 'HH:mm dd-MM-yyyy')

      for (const parameter of measurementParameters) {
        if (obj[parameter] !== undefined) {
          dataPoint[`${obj['sen_id']}_${parameter}`] = obj[parameter]
        }
      }

      return dataPoint
    })

  return formattedData
}

// Get parameters that measure something => to visualize them
const getMeasurementParameters = (logs) =>  {
  return [ ...new Set(logs.flatMap(Object.keys).filter(item => !SUPPRESS.includes(item))) ]
}

// Get unique ids of sensor type, either small sensor that only has "measurement" or bigger sensor
const getSmallSensorIds = (logs, smallSensor = false) => {
  return [ ...new Set( logs
    .filter(sensor => smallSensor ? sensor['measurement'] : !sensor['measurement'])
    .map(obj => obj['sen_id']))
  ]
}

const formatData = (logs, measurementParameters) => {
  return combineObjectsByDate(
    combineSensorIdAndMeasurementParameter(logs, measurementParameters))
}

export {
  formatData,
  groupByDeviceID,
  getMeasurementParameters,
  getSmallSensorIds,
}