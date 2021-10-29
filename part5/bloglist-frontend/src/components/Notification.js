import React from 'react'

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

export default Notification