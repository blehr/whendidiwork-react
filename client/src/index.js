import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import storeConfig from "./store";
import Routes from "./routes";
import registerServiceWorker from "./registerServiceWorker";
import "./styles/index.css";

const store = storeConfig();

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById("root")
);
// registerServiceWorker();
