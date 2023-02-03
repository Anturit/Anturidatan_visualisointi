const dummy= (users) => {
  return users.length
}

const userSensors = (user) => {
  return user.sensordataObjectIds
}

module.exports = {
  dummy, userSensors
}