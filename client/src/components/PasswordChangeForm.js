import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setNotification } from '../reducers/notificationReducer.js'
import userService from '../services/userService'
import PasswordFeedback from './PasswordFeedback'
import {
  TextField,
  Typography,
  Box,
  Button
} from '@mui/material'

const PasswordChangeForm = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPasswordSecurityFeedback, setShowPasswordSecurityFeedback] = useState(false)

  const dispatch = useDispatch()
  const user_id = useSelector(state => state.loginForm.user.id)
  const navigate = useNavigate()
  const errorMessagesInFinnish = [
    ['old password does not match user password', 'Vanha salasana väärin!'],
    ['password confirmation does not match with new password', 'Uudet salasanat eivät täsmää!'],
    ['new password can\'t be same as old password', 'Uusi salasana ei voi olla sama kuin vanha salasana!'],
    ['password must be at least', 'Uusi salasana ei täytä salasanavaatimuksia!'],
  ]

  /**
   * Returns corresponding error message in finnish
   * @param {string} errorText
   * @returns {string} Error text in finnish
   */
  const getErrorMessageInFinnish = (errorText) => {
    for (const [english, finnish] of errorMessagesInFinnish) {
      if (errorText.includes(english)) {
        return finnish
      }
    }
    return 'Tuntematon virhe lomakkeen lähettämisessä'
  }

  const submit = async (event) => {
    event.preventDefault()
    try {
      await userService.changePassword(user_id, oldPassword, newPassword, confirmNewPassword)
      dispatch(setNotification('Salasana vaihdettu onnistuneesti!\nKirjaudu sisään uudella salasanalla.', 10000))
      userService.logoutLocalUser(dispatch)
      navigate('/login')
    } catch (error) {
      dispatch(setNotification(
        getErrorMessageInFinnish(error.response.data.error), 3500, 'alert'
      ))
    }
  }

  return (
    <div data-cy='passwordChangeForm' style={{ paddingBottom: '1em' }}>
      <form onSubmit={submit}>
        <Typography variant='h2'>Vaihda salasana</Typography>
        <Box marginTop='1em'>
          <Typography variant='body2'>Vanha salasana</Typography>
          <TextField
            data-cy='oldPassword'
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
          />
        </Box>
        <Box marginTop='1em'>
          <Typography variant='body2'>Uusi salasana</Typography>
          <TextField
            data-cy='newPassword'
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            onFocus={() => setShowPasswordSecurityFeedback(true)}
          />
          {showPasswordSecurityFeedback && <PasswordFeedback password={newPassword} />}
          <Typography variant='body2'>Vahvista uusi salasana</Typography>
          <TextField
            data-cy='confirmNewPassword'
            type="password"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
          />
          {(newPassword === confirmNewPassword)
            ? <Typography variant='body2'>Onnistunut salasanan vaihto aiheuttaa automaattisen uloskirjautumisen</Typography>
            : <Typography variant='body2'>Uusi salasana ja vahvista uusi salasana eivät täsmää</Typography>
          }
          <br />
          <Button
            data-cy='passwordChangeButton'
            color="primary"
            variant="contained"
            type="submit">
              Vaihda salasana
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default PasswordChangeForm

