import React from 'react'


const mainStyle = {
  border: '2px solid black',
  borderRadius: '5px',
  padding: '0.5%',
  color: 'white',
  textAlign: 'center'
}
const styleError = {
  ...mainStyle,
  backgroundColor: 'red'
}

const styleMessage = {
  ...mainStyle,
  backgroundColor: 'green'
}

const Notification = ({ notification }) => {
  if(notification.message){
    if(notification.isError){
      return(<div id='error-note' style={styleError}><h3>{notification.message}</h3></div>)
    }
    return(<div id='note' style={styleMessage}><h3>{notification.message}</h3></div>)
  }
}

export default Notification