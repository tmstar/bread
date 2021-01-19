import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { MuiThemeProvider, unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: blue["300"],
      main: blue["500"],
      dark: blue["700"],
    },
  },
  props: {
    MuiCheckbox: {
      color: "primary",
    },
    MuiRadio: {
      color: "primary",
    },
    MuiSwitch: {
      color: "primary",
    },
    MuiList: {
      dense: true,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={darkTheme}>
      <App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
