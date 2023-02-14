
import { format, parseISO, roundToNearestMinutes } from 'date-fns'
import { groupBy, chain, spread, assign } from 'lodash'

const SUPPRESS = ['id', 'sen_id',  'date', 'seq_number', 'device', 'sen_battery', 'dev_battery']

const groupByDeviceID = (senders) => {
  return groupBy(senders, 'device')
}

const combineObjectsByDate = (logs) => {
  const formattedData =
    chain(logs)
      .groupBy('date')
      .map(spread(assign))
      .value()

  return formattedData
}

const combineSensorIdAndMeasurementParameter = ( logs, measurementParameters ) => {
  const formattedData = logs.map((obj) => {
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

const getMeasurementParameters = (logs) =>  {
  return [ ...new Set(logs.flatMap(Object.keys).filter(item => !SUPPRESS.includes(item))) ]
}

const getSmallSensorIds = (logs, smallSensor = false) => {
  return [ ...new Set( logs
    .filter(sensor => smallSensor ? sensor['measurement'] : !sensor['measurement'])
    .map(obj => obj['sen_id']))
  ]
}

const formatData = (logs, measurementParameters) => {
  return combineObjectsByDate(combineSensorIdAndMeasurementParameter(logs, measurementParameters))
}

export {
  formatData,
  groupByDeviceID,
  getMeasurementParameters,
  getSmallSensorIds,
}