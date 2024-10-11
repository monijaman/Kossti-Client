import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '@/redux/features/counter/counterSlice'
import uploadReducer from '@/redux/features/upload/uploadSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    upload: uploadReducer,
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
