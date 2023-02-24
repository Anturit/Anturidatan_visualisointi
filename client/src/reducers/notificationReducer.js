import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: '' }

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      console.log('action.payload.message:', action.payload.message)
      state.message = action.payload.message
      state.type = action.payload.type
      return state
    },
    clearNotification() {
      console.log('clear')
      return initialState
    },
  },
})

export const setNotification = (message, timeMs, type = 'info') => {
  console.log('setNotification ', message, timeMs)
  return async (dispatch) => {
    const notification = {
      message: message,
      type: type,
    }
    dispatch(createNotification(notification))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeMs)
  }
}

export const { createNotification, clearNotification } =
    notificationSlice.actions
export default notificationSlice.reducer