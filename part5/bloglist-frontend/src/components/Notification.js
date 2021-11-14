import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, error }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  if (error) {
    notificationStyle.color = 'red'
  }

  if (message === null) {
    return null
  }

  return (
    <div>
      <div style={notificationStyle}>
        {message}
      </div>
    </div>  
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  error: PropTypes.bool.isRequired
}

export default Notification