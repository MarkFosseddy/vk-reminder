import React from "react";
import { Link } from "react-router-dom";

type Props = {};

export default function Home({}: Props) {
  return(
    <div>
      <h1>Home</h1>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}
