import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { History } from "history";

import { StorageKeys } from "../../types";
import { StoreThunk } from "../index";

import { VKLib } from "../../lib/vk";
import axios from "axios";

type User = {
  id: string,
  first_name: string,
  last_name: string,
  photo_100: string
};

type SliceState = {
  user: User | null,
  loading: boolean,
  initLoading: boolean,
  error: string | null
};

const initialState = {
  user: null,
  loading: false,
  // @TODO: think about app initial loading
  initLoading: true,
  error: null
} as SliceState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setInitLoading(state, action: PayloadAction<boolean>) {
      state.initLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    }
  }
});

export function loginAction(history: History): StoreThunk {
  return async function(dispatch) {
    const { setLoading, setError, setUser } = userSlice.actions;

    const loginRes = await VKLib.Auth.login();
    if (!loginRes.session) return;

    dispatch(setLoading(true));
    dispatch(setError(null));
    
    // @TODO: delete this
    await new Promise(resolve => setTimeout(() => { resolve(true); }, 1000));

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

    console.log("IS MESSAGES ALLOWED: ", data);

    dispatch(setLoading(false));


    history.replace("/allow-community-messages");
  };
}

export function persistLoginAction(history: History, redirectPath: string): StoreThunk {
  return async function(dispatch) { 
    const { setInitLoading, setUser } = userSlice.actions;

    dispatch(setInitLoading(true));

    // @TODO: delete this
    await new Promise(resolve => setTimeout(() => resolve(true), 500));

    const loginStatusRes = await VKLib.Auth.getLoginStatus();
    const userId = localStorage.getItem(StorageKeys.VK_ID);

    if (!loginStatusRes.session || !userId) {
      dispatch(setInitLoading(false));
      return;
    }

    // @TODO: delete this
    await new Promise(resolve => setTimeout(() => resolve(true), 1000));

    const userInfoRes = await VKLib.Api.getUserInfo(userId);

    if (userInfoRes.error || !userInfoRes.response[0]) {
      localStorage.removeItem(StorageKeys.VK_ID);
      setInitLoading(false);
      return;
    }

    const { id, last_name, first_name, photo_100 } = userInfoRes.response[0];
    dispatch(setUser({ id, last_name, first_name, photo_100 }));
    dispatch(setInitLoading(false));

    history.replace(redirectPath);
  };
}

export function logoutAction(history: History): StoreThunk {
  return async function(dispatch) {
    const { setLoading, setUser } = userSlice.actions;

    dispatch(setLoading(true));

    // @TODO: delete this
    await new Promise(resolve => setTimeout(() => resolve(true), 500));

    await VKLib.Auth.logout();

    localStorage.removeItem(StorageKeys.VK_ID);
    dispatch(setUser(null));
    dispatch(setLoading(false));

    history.replace("/login");
  };
}
