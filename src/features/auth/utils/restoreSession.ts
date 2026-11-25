import { store } from "../../../app/store";
import { authApi } from "../api/authApi";
import { logout } from "../store/authSlice";

let promise: Promise<void> | null = null;

export function restoreSession(): Promise<void> {
  promise ??= (async () => {
    const refreshToken = store.getState().auth.refreshToken;
    if (!refreshToken) return;
    try {
      await store.dispatch(authApi.endpoints.refresh.initiate({ refreshToken })).unwrap();
    } catch {
      store.dispatch(logout());
    }
  })();
  return promise;
}
