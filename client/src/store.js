import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
})

export default store