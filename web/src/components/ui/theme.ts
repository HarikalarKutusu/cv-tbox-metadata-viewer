import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00897b",
    },
    secondary: {
      main: "#ee9a9d",
    },
  },
});

export const appTheme = responsiveFontSizes(theme);
