import React from "react";
import { useHistory } from "react-router-dom";

import { useStoreDispatch, useStoreSelector } from "../../store";
import { loginAction } from "../../store/slices/user";

type Props = {};

export default function Login({}: Props) {
  const history = useHistory();
  const dispatch = useStoreDispatch();
  const loading = useStoreSelector(state => state.user.loading);
  const error = useStoreSelector(state => state.user.error);

  if (loading) {
    return(
      <div>LOADING...</div>
    );
  }

  if (error) {
    return(
      <div>
        <p>There was an error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return(
    <div>
      <h1>Login Page</h1>
      <button onClick={async () => {
        dispatch(loginAction(history));
      }}>
        VK Auth
      </button>
    </div>
  );
}
