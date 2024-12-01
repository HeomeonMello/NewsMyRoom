import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 1. 상태 타입 정의
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
    email: string;
  } | null;
}

// 2. 초기 상태 정의
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

// 3. 슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ id: string; username: string; email: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

// 4. 액션과 리듀서 내보내기
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
