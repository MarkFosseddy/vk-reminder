import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

import { StorageKeys } from "../../types";
import { StoreThunk } from "../index";
import { routes, history } from "../../routing";
import { VKLib } from "../../lib/vk";

type User = {
  id: string,
  first_name: string,
  last_name: string,
  photo_100: string
};

type SliceState = {
  user: User | null,
  loading: boolean,
  autoLoginLoading: boolean,
  error: string | null
};

const initialState = {
  user: null,
  loading: false,
  autoLoginLoading: true,
  error: null
} as SliceState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAutoLoginLoading(state, action: PayloadAction<boolean>) {
      state.autoLoginLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    }
  }
});

export function login(): StoreThunk {
  return async function(dispatch) {
    const { setLoading, setError, setUser } = userSlice.actions;

    const loginRes = await VKLib.Auth.login();
    if (!loginRes.session) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    const userInfoRes = await VKLib.Api.getUserInfo(loginRes.session.user.id);
    if (userInfoRes.error || !userInfoRes.response[0]) {
      dispatch(setError("Something went wrong :("));
      dispatch(setLoading(false));
      return;
    }

    const { id, last_name, first_name, photo_100 } = userInfoRes.response[0];
    localStorage.setItem(StorageKeys.VK_ID, id);
    dispatch(setUser({ id, last_name, first_name, photo_100 }));

    const { data } = await axios.post("http://192.168.0.78:3000", { id });

    dispatch(setLoading(false));

    if (data.is_allowed) {
      history.replace(routes.dashboard);
    } else {
      history.replace(routes.allowCommunityMessages);
    }
  };
}

export function autoLogin(redirectPath: string): StoreThunk {
  return async function(dispatch) { 
    const { setAutoLoginLoading, setUser } = userSlice.actions;

    dispatch(setAutoLoginLoading(true));

    const loginStatusRes = await VKLib.Auth.getLoginStatus();
    const userId = localStorage.getItem(StorageKeys.VK_ID);
    if (!loginStatusRes.session || !userId) {
      dispatch(setAutoLoginLoading(false));
      return;
    }

    const userInfoRes = await VKLib.Api.getUserInfo(userId);
    if (userInfoRes.error || !userInfoRes.response[0]) {
      localStorage.removeItem(StorageKeys.VK_ID);
      setAutoLoginLoading(false);
      return;
    }

    const { id, last_name, first_name, photo_100 } = userInfoRes.response[0];
    dispatch(setUser({ id, last_name, first_name, photo_100 }));

    const { data } = await axios.post("http://192.168.0.78:3000", { id });

    dispatch(setAutoLoginLoading(false));

    // @TODO: think about proper redirects
    if (data.is_allowed) {
      history.replace(redirectPath);
    } else {
      history.replace(routes.allowCommunityMessages);
    }
  };
}

export function logout(): StoreThunk {
  return async function(dispatch) {
    const { setLoading, setUser } = userSlice.actions;

    dispatch(setLoading(true));

    await VKLib.Auth.logout();

    localStorage.removeItem(StorageKeys.VK_ID);
    dispatch(setUser(null));

    dispatch(setLoading(false));

    history.replace(routes.login);
  };
}
