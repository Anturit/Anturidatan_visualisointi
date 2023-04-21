import { Typography } from '@mui/material'

const PasswordFeedback = ({ password }) => {
  const regexAndHint = [
    [/.{8,}/g, 'ainakin kahdeksan merkkiä'],
    [/[0-9]/g, 'numero'],
    [/[#?!@$%^()&*-]/g, 'erikoismerkki'],
    [/[A-Z]/g, 'iso kirjain'],
    [/[a-z]/g, 'pieni kirjain'],
  ]
  /**
   * Return password improvement feedback in finnish
   * @returns {string}
   */
  const passwordImprovementHintText = () => {
    const hints = regexAndHint.reduce((hints, [regex, hint]) =>
      password.match(regex)
        ? hints
        : [hint, ...hints]
    , [])

    if (hints.length === 0) return ''

    return 'Salasanan tulee sisältää: ' + (
      hints.length === 1
        ? hints[0]
        : hints.slice(0, -1).join(', ') + ' ja ' + hints.slice(-1)
    )
  }

  return(
    <>
      <Typography variant='body2'>
        {passwordImprovementHintText()}
      </Typography>
    </>
  )
}

export default PasswordFeedback