import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import storeConfig from "./store";
import Routes from "./routes";
import "./styles/index.css";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { checkForUser } from "./actions";
// import registerServiceWorker from "./registerServiceWorker";

// Needed for onTouchTap
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#1976D2",
    accent1Color: "#FF1744"
  }
});

const store = storeConfig();

store.dispatch(checkForUser());

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <Routes />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
// registerServiceWorker();