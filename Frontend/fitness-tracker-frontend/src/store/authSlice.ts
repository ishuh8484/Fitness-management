import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, TokenData } from '../types/index.ts'

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: TokenData; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userId = action.payload.user.sub;

      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('userId', action.payload.user.sub)
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
