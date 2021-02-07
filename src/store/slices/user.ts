import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { History } from "history";

import { StorageKeys } from "../../types";
import { StoreThunk } from "../index";

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
  error: string | null
};

const initialState = {
  user: null,
  loading: false,
  error: null
} as SliceState;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.loading = false;
      state.user = action.payload;
    },
    loginFail(state) {
      state.loading = false;
      state.error = "Something went wrong :("
    }
  }
});

export const loginAction = (history: History): StoreThunk => async dispatch => {
  const { loginStart, loginFail, loginSuccess } = userSlice.actions;

  const loginRes = await VKLib.Auth.login();
  if (!loginRes.session) return;

  dispatch(loginStart());
  // @TODO: delete this
  await new Promise(resolve => setTimeout(() => { resolve(true) }, 1000));
  const userInfoRes = await VKLib.Api.getUserInfo(loginRes.session.user.id);

  if (userInfoRes.error || !userInfoRes.response[0]) {
    dispatch(loginFail());
    return;
  }

  const { id, last_name, first_name, photo_100 } = userInfoRes.response[0];
  dispatch(loginSuccess({ id, last_name, first_name, photo_100 }));
  localStorage.setItem(StorageKeys.VK_ID, id);

  history.replace("/dashboard");
};

export const persistLoginAction =
  (history: History, redirectPath: string): StoreThunk =>
  async dispatch => {
    const { loginSuccess, setLoading } = userSlice.actions;

    dispatch(setLoading(true));

    // @TODO: delete this
    await new Promise(resolve => setTimeout(() => resolve(true), 500));
    const loginStatusRes = await VKLib.Auth.getLoginStatus();
    const userId = localStorage.getItem(StorageKeys.VK_ID);
    console.log("GET STATUS LOGIN: ", loginStatusRes);
    console.log("VK ID: ", userId);

    if (!loginStatusRes.session || !userId) {
      dispatch(setLoading(false));
      return;
    }

    // @TODO: delete this
    await new Promise(resolve => setTimeout(() => resolve(true), 1000));
    const userInfoRes = await VKLib.Api.getUserInfo(userId);

    if (userInfoRes.error || !userInfoRes.response[0]) {
      localStorage.removeItem(StorageKeys.VK_ID);
      setLoading(false);
      return;
    }

    const { id, last_name, first_name, photo_100 } = userInfoRes.response[0];
    dispatch(loginSuccess({ id, last_name, first_name, photo_100 }));

    history.replace(redirectPath);
  };
