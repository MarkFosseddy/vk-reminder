import React from "react";
import { Hello } from "./components/Hello";

export function App() {
  return(
    <div>
      <Hello name="Mark" />
      <p className="red">Global style</p>
    </div>
  );
}
