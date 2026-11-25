import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadRefreshToken } from "../utils/tokenStorage";
import type { Session, User } from "../types/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  //"loading" = a stored refresh token
  // exists and we haven't verified it yet
  status: "loading" | "ready";
}

const stored = loadRefreshToken();

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: stored,
  status: stored ? "loading" : "ready",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.status = "ready";
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "ready";
    },
  },
});

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;
