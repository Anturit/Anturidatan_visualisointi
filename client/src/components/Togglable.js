import { useState } from 'react'
import Button from '@mui/material/Button'
/**
 * Function that creates Toggleable component
  * @param {Object} props - Props object containing children, buttonLabel and id.
 * @returns {JSX.Element} - JSX element to render
 */
const Togglable = (props) => {

  //React hook that creates state variable visible and function setVisible to change the visibility.
  const [visible, setVisible] = useState(false)

  //Objects that contain CSS styles for hiding and showing the component.
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    //Function that toggles visibility of component.
    //Visibility is set to opposite of current state.
    setVisible(!visible)
  }

  return (
    <>
      <div style={hideWhenVisible}>
        <Button sx={{ bgcolor: 'gray', color:'white' }} onClick={toggleVisibility} data-cy={`open-togglable-${props.id}`}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button sx={{ bgcolor: 'gray', color:'white' }}  onClick={toggleVisibility} data-cy={`close-togglable-${props.id}`}>
          Peruuta
        </Button>
      </div>
    </>
  )
}

export default Togglable