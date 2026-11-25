import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/authSlice";
import { saveRefreshToken } from "../features/auth/utils/tokenStorage";
import { baseApi } from "../api/baseApi";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      //adding the RTK Query reducer to manage its cached API state
      [baseApi.reducerPath]: baseApi.reducer,
    },
    //adds the RTK Query middleware on top of the default: recommended by RTK Query docs
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
}

export const store = makeStore();
//These types are made because we want to avoid manually updating the types
// for store(from makeStore), state (from store's getState) ...
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

let lastToken = store.getState().auth.refreshToken;
store.subscribe(() => {
  const current = store.getState().auth.refreshToken;
  if (current !== lastToken) {
    lastToken = current;
    saveRefreshToken(current);
  }
});
