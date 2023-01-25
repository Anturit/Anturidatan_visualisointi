const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const style = {
    background: notification.type === 'alert' ? 'red' : 'green',
    color: 'black',
    fontSize: 18,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 280
  }

  return (
    <div id='notification' style={style}>
      {notification.message}
    </div>
  )
}

export default Notification