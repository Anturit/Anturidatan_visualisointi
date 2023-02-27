import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './reducers/usersReducer'
import loginFormReducer from './reducers/loginFormReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    users: usersReducer,
    loginForm: loginFormReducer,
    notification: notificationReducer,
  },
})

export default store