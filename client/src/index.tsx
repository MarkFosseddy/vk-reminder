import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "./store";

import { App } from "./app";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("app")
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
