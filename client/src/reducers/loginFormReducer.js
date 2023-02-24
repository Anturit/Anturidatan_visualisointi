import { createSlice } from '@reduxjs/toolkit'
const initialState = {  user: null }

const loginFormSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {

    setUser(state, action) {
      state.user = action.payload
      return state
    },
  },
})

export const {
  setUser,
} = loginFormSlice.actions
export default loginFormSlice.reducer