import * as React from "react";
import intl from "react-intl-universal";

// MUI
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Menu Button & Icons
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

// summary
import SummarizeIcon from "@mui/icons-material/Summarize";
// calculated
import CalculateIcon from "@mui/icons-material/Calculate";
// main buckets
import RuleIcon from "@mui/icons-material/Rule";
// training
import PsychologyIcon from "@mui/icons-material/Psychology";
// users
import GroupIcon from "@mui/icons-material/Group";
// ages
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
// gender
import TransgenderIcon from "@mui/icons-material/Transgender";
// Other (tech info)
import BuildIcon from "@mui/icons-material/Build";

// import BarChartIcon from "@mui/icons-material/BarChart";
// import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";

// App Components
import { useStore } from "./../../stores/store";
import { LanguageSelector } from "./../languageSelector";
import { MetadataTable } from "./../metaDataTable";
import { FilterSelectors } from "../filterSelectors";

//
// UI
//

// Menu Items

const menuItemsGraphs = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      {intl.get("menu.graphs.title")}
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);

// Copyright

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

export function AppUI() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { initDone } = useStore();
  const { tableView, setTableView } = useStore();

  const MenuItemsTable = () => {
    return (
      <React.Fragment>
        <ListSubheader component="div" inset>
          {intl.get("menu.views.title")}
        </ListSubheader>
        <ListItemButton onClick={() => setTableView("main")}>
          <ListItemIcon>
            <SummarizeIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.summary")} />
        </ListItemButton>
        <ListItemButton onClick={() => setTableView("calculated")}>
          <ListItemIcon>
            <CalculateIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.calculated")} />
        </ListItemButton>
        <ListItemButton onClick={() => setTableView("buckets-main")}>
          <ListItemIcon>
            <RuleIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.buckets-main")} />
        </ListItemButton>
        <ListItemButton onClick={() => setTableView("buckets-model")}>
          <ListItemIcon>
            <PsychologyIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.buckets-model")} />
        </ListItemButton>
        <ListItemButton onClick={() => setTableView("users")}>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.users")} />
        </ListItemButton>
        <ListItemButton onClick={() => setTableView("ages")}>
          <ListItemIcon>
            <ElderlyWomanIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.ages")} />
        </ListItemButton>
        <ListItemButton onClick={() => setTableView("genders")}>
          <ListItemIcon>
            <TransgenderIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.genders")} />
        </ListItemButton>
        <ListItemButton onClick={() => setTableView("other")}>
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.other")} />
        </ListItemButton>
      </React.Fragment>
    );
  };

  return !initDone ? (
    <></>
  ) : (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h4"
              color="inherit"
              noWrap
              align="left"
              sx={{ flexGrow: 1 }}
            >
              {intl.get("app.title")}
            </Typography>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              align="right"
              sx={{ flexGrow: 1 }}
            >
              {intl.get("ui.filter_table.label")}
            </Typography>
            <FilterSelectors />
            <LanguageSelector />
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MenuItemsTable />
            <Divider sx={{ my: 1 }} />
            {menuItemsGraphs}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              {/* <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid> */}
              {/* Recent Deposits */}
              {/* <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid> */}
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {/* <Orders /> */}
                  <MetadataTable
                    view="main"
                    defaultSortField="version"
                    defaultSortAsc={false}
                  />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// export default function AppUI() {
//   return <AppUIContent />;
// }
