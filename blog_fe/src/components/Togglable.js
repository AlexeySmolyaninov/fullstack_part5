import React, { useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisible = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return { toggleVisible }
  })

  return (
    <>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisible}>{props.buttonLabelOpen}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisible}>{props.buttonLabelClose}</button>
      </div>
    </>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabelOpen: PropTypes.string.isRequired,
  buttonLabelClose: PropTypes.string.isRequired
}

export default Togglable