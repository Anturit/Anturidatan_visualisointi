import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} data-cy={`open-togglable-${props.id}`}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility} data-cy={`close-togglable-${props.id}`}>
          Peruuta
        </button>
      </div>
    </>
  )
}

export default Togglable