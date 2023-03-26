import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/userService'
import senderService from '../services/senderService'
const initialState = {  user: null }

const loginFormSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {

    setUser(state, action) {
      state.user = action.payload
      if (state.user && state.user.token) {
        userService.setToken(state.user.token)
        senderService.setToken(state.user.token)
      } else {
        userService.removeToken()
        senderService.removeToken()
      }
      return state
    },
  },
})

export const {
  setUser,
} = loginFormSlice.actions
export default loginFormSlice.reducer