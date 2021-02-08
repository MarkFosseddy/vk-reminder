import React from "react";
import { useHistory } from "react-router-dom";

import { useStoreDispatch, useStoreSelector } from "../../store";
import { login } from "../../store/slices/user";

export default function Login() {
  const history = useHistory();
  const dispatch = useStoreDispatch();
  const loading = useStoreSelector(state => state.user.loading);
  const error = useStoreSelector(state => state.user.error);

  if (loading) {
    return (
      <div>LOADING... Login.tsx</div>
    );
  }

  if (error) {
    return (
      <div>
        <p>There was an error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={() => dispatch(login(history))}>
        VK Auth
      </button>
    </div>
  );
}
