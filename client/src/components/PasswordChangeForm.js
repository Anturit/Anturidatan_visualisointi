import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PasswordFeedback from './PasswordFeedback'
import { setNotification } from '../reducers/notificationReducer.js'
import userService from '../services/userService'

const PasswordChangeForm = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPasswordSecurityFeedback, setShowPasswordSecurityFeedback] = useState(false)

  const dispatch = useDispatch()
  const user_id = useSelector(state => state.loginForm.user.id)

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
    } catch (error) {
      dispatch(setNotification(
        getErrorMessageInFinnish(error.response.data.error), 3500, 'alert'
      ))
    }
  }

  return (
    <div data-cy='passwordChangeForm' style={{ paddingBottom:'1em' }}>
      <form onSubmit={submit}>
        <h2>Vaihda salasana</h2>
        <small>Vanha salasana</small>
        <div>
          <input
            data-cy='oldPassword'
            type="password"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <small>Uusi salasana</small>
        <div>
          <input
            data-cy='newPassword'
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onFocus={() => setShowPasswordSecurityFeedback(true)}
          />
          {showPasswordSecurityFeedback && <PasswordFeedback password={newPassword}/>}
        </div>
        <small>Vahvista uusi salasana</small>
        <div>
          <input
            data-cy='confirmNewPassword'
            type="password"
            name="confirmPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        {(newPassword === confirmNewPassword)
          ? <small>Onnistunut salasanan vaihto aiheuttaa automaattisen uloskirjautumisen</small>
          : <small>Uusi salasana ja vahvista uusi salasana eivät täsmää</small>
        }
        <br/>
        <button data-cy='passwordChangeButton' type="submit">Vaihda salasana</button>
      </form>
    </div>
  )
}

export default PasswordChangeForm
