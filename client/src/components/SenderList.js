import { groupByDeviceID } from '../utils/senderDataHandler'
import SenderVisualizer from './SenderVisualizer'

/**
* Groups SenderVisualizer by sender ids
* @param {Array.<Object>}
* @returns {JSX.Element}
*/
const SenderList = ({ senders }) => {

  const groupedSenders = groupByDeviceID(senders)

  return (
    <div className='senders'>
      {Object.entries(groupedSenders).map(([id, logs]) =>
        <SenderVisualizer key={id} id={id} logs={logs} />
      )}
    </div>
  )
}

export default SenderList