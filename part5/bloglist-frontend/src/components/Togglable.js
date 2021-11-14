import React from 'react'
import PropTypes from 'prop-types'

const Togglable = (props) => {
  const hideWhenVisible = { display: props.visible ? 'none' : '' }
  const showWhenVisible = { display: props.visible ? '' : 'none' }

  const toggleVisibility = () => {
    props.setVisible(!props.visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  setVisible: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
}

export default Togglable