# Koodin dokumentointikäytännöt

* Kommentoidaan koodi [JSDOC](https://jsdoc.app/) -käytäntöjen mukaisesti.
* Dokumentointi tehdään suoraan lähdekoodiin.
* Kommentoinnin tarkoitus on selventää, **mitä** koodi tekee ja **miksi**.


### Esimerkki 1

```
/**
 * Foo takes any argument.
 * The return value is 'baz' in all cases.
 * @param {*} bar - Any argument
 * @param {string} [optionalArg] - An optional argument that is a string
 */
function foo(bar, optionalArg) {
  return 'baz';
}
```

### Esimerkki 2

```
import { useState } from 'react'

const Togglable = (props) => {
  /**
   * Function that creates Toggleable component
    * @param {Object} props - Props object containing children, buttonLabel and id.
   * @returns {JSX.Element} - JSX element to render
   */

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
```