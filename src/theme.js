import { createTheme } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
/** @type {import("@mui/material/styles").Theme["palette"]} */
const palette = {
  primary: {
    main: "#33BEE7",
    linear: "linear-gradient(90.19deg, #8669E8 1.69%, #10CFFC 99.86%)",
    light: "#E1E5FF",
    white: "#fff",
    contrastText: "#fff"
  },
  secondary: {
    main: "#8569E6",
    linear: "linear-gradient(180deg, #876AE9 0%, #11D0FD 100%)",
  },
  error: {
    main: "#F44336",
  },
  success: {
    main: "#4caf50",
  },
  text: {
    primary: "#00394C",
    secondary: "#8569E6",
    gray: "#6D6D6D",
    black: "#343E48",
    info: "#00394C",
  },
};
const theme = {
  typography: { fontFamily: ["Tajawal", "sans-serif"].join(",") },
  palette,
};
export const RTLTheme = createTheme({
  direction: "rtl",
  ...theme,
});
export const LTRTheme = createTheme({
  direction: "ltr",
  ...theme,
});

export const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export const cacheLtr = createCache({
  key: "muiltr",
});
