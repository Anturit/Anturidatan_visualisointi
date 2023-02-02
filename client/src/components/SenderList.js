/* eslint-disable no-unused-vars */
import { groupBy } from 'lodash/collection'
import Sender from './Sender'

const SenderList = ({ senders }) => {

  const groupedSenders = groupBy(senders, 'device')
  return (
    <div className='senders'>
      {Object.entries(groupedSenders).map(([id, logs]) =>
        <Sender key={id} id={id} logs={logs} />
      )}
    </div>
  )
}


export default SenderList