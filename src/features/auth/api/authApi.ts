import { baseApi } from "../../../api/baseApi";
import { AUTH_API_URL } from "../../../lib/config";
import { setSession } from "../store/authSlice";
import type { LoginForm } from "../schemas/schemas";
import type { Session, User } from "../types/types";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

async function storeSession(
  dispatch: (action: ReturnType<typeof setSession>) => unknown,
  promise: Promise<{ data: Session }>,
) {
  try {
    const { data } = await promise;
    dispatch(setSession(data));
  } catch {
    //the error is exposed by the mutation hook, nothing to do here
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Session, LoginForm>({
      query: (body) => ({
        url: `${AUTH_API_URL}/auth/login`,
        method: "POST",
        body,
      }),
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        storeSession(dispatch, queryFulfilled),
    }),
    register: build.mutation<Session, RegisterBody>({
      query: (body) => ({
        url: `${AUTH_API_URL}/auth/register`,
        method: "POST",
        body,
      }),
      onQueryStarted: (_arg, { dispatch, queryFulfilled }) =>
        storeSession(dispatch, queryFulfilled),
    }),
    refresh: build.mutation<Session, { refreshToken: string }>({
      query: (body) => ({
        url: `${AUTH_API_URL}/auth/refresh`,
        method: "POST",
        body,
      }),
      onQueryStarted: (_args, { dispatch, queryFulfilled }) =>
        storeSession(dispatch, queryFulfilled),
    }),
    logout: build.mutation<void, { refreshToken: string }>({
      query: (body) => ({
        url: `${AUTH_API_URL}/auth/logout`,
        method: "POST",
        body,
      }),
    }),
    getMe: build.query<User, void>({
      query: () => `${AUTH_API_URL}/auth/me`,
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useGetMeQuery } = authApi;
