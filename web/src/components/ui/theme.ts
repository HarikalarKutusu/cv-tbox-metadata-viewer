import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const PRIMARY_COLOR = "#00897b";;
export const SECONDARY_COLOR = "#ee9a9d";;

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
  },
});

export const appTheme = responsiveFontSizes(theme);
