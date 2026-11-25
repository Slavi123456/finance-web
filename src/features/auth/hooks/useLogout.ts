import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useLogoutMutation } from "../api/authApi";
import { logout } from "../store/authSlice";
import { baseApi } from "../../../api/baseApi";

export function useLogout() {
  const dispatch = useAppDispatch();
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);
  const [logoutRequest] = useLogoutMutation();

  return async () => {
    try {
      if (refreshToken) await logoutRequest({ refreshToken }).unwrap();
    } catch {
      //even if the server call fails, log out locally
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
    }
  };
}
