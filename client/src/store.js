import { configureStore } from '@reduxjs/toolkit'
import usersReducer from './reducers/usersReducer'
import loginFormReducer from './reducers/loginFormReducer'

const store = configureStore({
  reducer: {
    users: usersReducer,
    loginForm: loginFormReducer,
  },
})

export default store