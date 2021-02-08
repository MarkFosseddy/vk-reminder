import React from "react";
import { Link } from "react-router-dom";

import { routes } from "../../routing/routes";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link to={routes.login}>Go to Login</Link>
    </div>
  );
}
