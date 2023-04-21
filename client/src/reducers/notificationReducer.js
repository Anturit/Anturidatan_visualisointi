import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: '', type: 'info' }

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

/**
 * Sets notification to redux state for specified duration
 * @param {string} message - message
 * @param {number} [timeMs=4000] - optional notification duration in milliseconds. defaults to 4000
 * @param {string} [type='info'] - optional message display type: 'error' or 'info'. defaults to 'info'
 */
export const setNotification = (message, timeMs = 4000, type = 'info') => {
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