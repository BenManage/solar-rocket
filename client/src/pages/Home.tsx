import { ThemeProvider } from "@emotion/react";
import { Typography } from "@mui/material";
import {createTheme, responsiveFontSizes} from "@mui/material/styles"
import { AppLayout } from "../layouts/AppLayout";

const Home = (): JSX.Element => {
  let theme = createTheme();
  theme = responsiveFontSizes(theme);
  return (
    <AppLayout>
      <ThemeProvider theme={theme}>
        <Typography variant="h2">Solar Rocket App</Typography>
        <Typography variant="h3">Welcome to the Solar Rocket App</Typography>
        
      </ThemeProvider>
    </AppLayout>
  );
};

export { Home };
