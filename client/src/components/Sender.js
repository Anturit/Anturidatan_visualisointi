import { useState } from 'react'

const Sender = ({ id, logs }) => {
  const [detailed, setDetailed] = useState(false)

  const hideWhenDetailed = { display: detailed ? 'none' : '' }
  const showWhenDetailed = { display: detailed ? '' : 'none' }

  const sortAscending = (a, b) => { return (a.date > b.date) ? 1 : -1 }

  const toggleDetails = () => {
    setDetailed(!detailed)
  }

  return (
    <div className='sender-logs'>
      <div style={hideWhenDetailed}>
        <p><b>{id} </b><button onClick={toggleDetails}>näytä</button></p>
      </div>
      <div style={showWhenDetailed}>
        <p><b>Laite-ID {id}:n logit </b></p>
        {logs.sort(sortAscending).map(log =>
          <div key={log.seq_number}>
            <p>date: {log.date} sensor_id: {log.sen_id} measurement: {log.measurement}</p>
          </div>
        )}
        <button onClick={toggleDetails}>piilota</button>
      </div>
    </div>
  )
}


export default Sender