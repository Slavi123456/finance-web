import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { AUTH_API_URL } from "../lib/config";
import type { RootState } from "../app/store"; //only type import -> no import cycle
import { logout, setSession } from "../features/auth/store/authSlice";
import type { Session } from "../features/auth/types/types";

const rawBaseQuery = fetchBaseQuery({
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

//represents the type of the extraOptions in the rawBaseQuery
type Extra = Parameters<typeof rawBaseQuery>[2];

//All callers that hit 401 at the same moment wait for this One refresh request
let refreshPromise: Promise<boolean> | null = null;

function refreshOnce(api: BaseQueryApi, extra: Extra): Promise<boolean> {
  refreshPromise ??= (async () => {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) return false;

    const result = await rawBaseQuery(
      { url: `${AUTH_API_URL}/auth/refresh`, method: "POST", body: { refreshToken } },
      api,
      extra,
    );

    if (result.data) {
      api.dispatch(setSession(result.data as Session));
      return true;
    }

    //Only log out when the server rejected the token, not on network errors
    if (result.error?.status === 401) api.dispatch(logout());
    return false;
  })().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

//These endpoint must never trigger a refresh, otherwise a wrong password would
const NO_REAUTH = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extra,
) => {
  let result = await rawBaseQuery(args, api, extra);

  const url = typeof args === "string" ? args : args.url;
  const skip = NO_REAUTH.some((path) => url.endsWith(path));
  const hasRefreshToken = Boolean((api.getState() as RootState).auth.refreshToken);

  if (result.error?.status === 401 && !skip && hasRefreshToken) {
    if (await refreshOnce(api, extra)) {
      //retry once with the new token
      result = await rawBaseQuery(args, api, extra);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Purchase", "Product", "Category", "Analytics"],
  endpoints: () => ({}),
});
