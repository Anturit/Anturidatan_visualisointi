import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material'

const SenderDropdown = ({ senderDeviceIds, setSelectedSenderId }) => {

  const handleSenderChange = (event) => {
    event.preventDefault()
    setSelectedSenderId(event.target.value)
  }

  return <FormControl variant='standard'>
    <InputLabel id='senderDropdown-label'>Valittu lähetin</InputLabel>
    <Select
      labelId='senderDropdown-label'
      data-cy='senderDropdown'
      onChange={handleSenderChange}
      label='Valittu lähetin'
      defaultValue={senderDeviceIds[0]}
    >
      {senderDeviceIds.map(sender => <MenuItem key={sender} value={sender}>{sender}</MenuItem>)}
    </Select>
  </FormControl>
}

export default SenderDropdown
