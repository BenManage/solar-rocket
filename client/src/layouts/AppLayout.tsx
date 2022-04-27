import "../App.css";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { useLocation, Link as RouterLink } from "react-router-dom";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  RocketLaunch as RocketLaunchIcon,
  WbSunny as WbSunnyIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const drawerWidth: number = 240;

interface pageProps {
  children: React.ReactNode;
  title?: String;
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    zmarginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const AppLayout: React.FC<pageProps> = ({ children, title }) => {
  const [pageName, setPageName] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);

  let location = useLocation();

  useEffect(() => {
    setPageName(location.pathname);
  }, [location]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  

  return (
    <Box sx={{ display: "flex" }}>
      <Helmet>
        {title ? (
          <title>
            {title} | {process.env.REACT_APP_TITLE}
          </title>
        ) : (
          ""
        )}
      </Helmet>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={drawerOpen}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Solar Rocket
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        PaperProps={{ elevation: 5 }}
        anchor="left"
        variant="persistent"
        open={drawerOpen}
        sx={{
          zwidth: drawerOpen ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <List sx={{ mt: 6 }}>
          {[
            { text: "Home", icon: <HomeIcon />, link: "/" },
            {
              text: "Missions",
              icon: <RocketLaunchIcon />,
              link: "/missions",
            },
            { text: "Weather", icon: <WbSunnyIcon />, link: "/weather" },
            {
              text: "Preferences",
              icon: <SettingsIcon />,
              link: "/preferences",
            },
          ].map((item, index) => (
            <Link
              component={RouterLink}
              to={item.link}
              key={index}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem button>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: pageName === item.link ? "bold" : "light",
                  }}
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
      <Main open={drawerOpen} ><DrawerHeader />{children}</Main>
    </Box>
  );
};

export { AppLayout };
