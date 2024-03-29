import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

export const { setUsers, setUserDevices } = userSlice.actions

export default userSlice.reducer