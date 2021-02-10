import React from "react";

import { useLogin } from "../../hooks/user";

export default function Login() {
  const { loading, error, login } = useLogin();

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

      <button onClick={login}>
        VK Auth
      </button>
    </div>
  );
}
