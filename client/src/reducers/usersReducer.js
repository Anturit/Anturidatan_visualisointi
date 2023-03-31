import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/userService'

const initialState = []

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    setUserDevices(state, action) {
      return action.payload
    }
  },
})

export const { setUsers, setUserDevices } = userSlice.actions

export const getUsers = () => {
  return async dispatch => {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  }

}

export const getUserDevices = (user_id) => {
  return async dispatch => {
    const user = await userService.getUser(user_id)
    dispatch(setUserDevices(user.senderDeviceIds))
  }
}

export const deleteUserDevice = (userId, deviceId) => {
  return async dispatch => {
    await userService.removeSenderDeviceId(userId, deviceId)
    dispatch(setUserDevices(userId, deviceId))
  }
}




export default userSlice.reducer