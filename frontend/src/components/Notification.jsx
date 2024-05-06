const Notification = ({ message, style }) => {
  if (message === null || style === null) {
    return null
  }

  return (
    <div className={style}>
      {message}
    </div>
  )
}

export default Notification