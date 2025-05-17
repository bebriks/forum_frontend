import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './redux/index.ts'
import { thunk } from 'redux-thunk'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(thunk)
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>