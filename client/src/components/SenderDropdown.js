const SenderDropdown = ({ senderDeviceIds, setSelectedSenderId })  => {

  const handleSenderChange = (event) => {
    event.preventDefault()
    setSelectedSenderId(event.target.value)
  }

  return (
    <div>
      <label htmlFor='senders'>Valitse lähetin:</label>
      <select name='senders' id='senders' onChange={handleSenderChange} data-cy='senderDropdown'>
        {senderDeviceIds.map(sender => <option key={sender} value={sender}>{sender}</option>)}
      </select>
    </div>
  )
}

export default SenderDropdown
