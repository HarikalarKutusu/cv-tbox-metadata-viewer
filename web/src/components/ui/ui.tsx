import { useState } from "react";
import intl from "react-intl-universal";

// MUI
import {
  styled,
  ThemeProvider,
  CssBaseline,
  Drawer as MuiDrawer,
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  // ListSubheader,,
} from "@mui/material";

// import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

// import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

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
// Text Corpus
import AbcIcon from "@mui/icons-material/Abc";
// Other (tech info)
import BuildIcon from "@mui/icons-material/Build";
// CV Totals
import FunctionsIcon from "@mui/icons-material/Functions";
// Delta Values
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
// APP
import { appTheme } from "./theme";
import { useStore } from "./../../stores/store";
import { LanguageSelector } from "./../languageSelector";
import { MetadataTable } from "./../metaDataTable";
import { TotalsTable } from "./../totalsTable";
import { FilterSelectors } from "../filterSelectors";
import { GraphBuilder } from "../graphBuilder";
import { AppInfo } from "./appInfo";
import { DeltaTable } from "../deltaTable";
// import { ListItem } from "@mui/material";

//
// UI
//

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

export function AppUI() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const { initDone } = useStore();
  const { tableView, setTableView } = useStore();

  // Menu Items

  const MenuItemsTable = () => {
    return (
      <>
        <ListItemButton
          onClick={() => setTableView("main")}
          title={intl.get("menu.views.alldata")}
          aria-label={intl.get("menu.views.alldata")}
        >
          <ListItemIcon>
            <SummarizeIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.alldata")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("calculated")}
          title={intl.get("menu.views.calculated")}
          aria-label={intl.get("menu.views.calculated")}
        >
          <ListItemIcon>
            <CalculateIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.calculated")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("buckets-main")}
          title={intl.get("menu.views.buckets-main")}
          aria-label={intl.get("menu.views.buckets-main")}
        >
          <ListItemIcon>
            <RuleIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.buckets-main")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("buckets-model")}
          title={intl.get("menu.views.buckets-model")}
          aria-label={intl.get("menu.views.buckets-model")}
        >
          <ListItemIcon>
            <PsychologyIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.buckets-model")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("users")}
          title={intl.get("menu.views.users")}
          aria-label={intl.get("menu.views.users")}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.users")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("ages")}
          title={intl.get("menu.views.ages")}
          aria-label={intl.get("menu.views.ages")}
        >
          <ListItemIcon>
            <ElderlyWomanIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.ages")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("genders")}
          title={intl.get("menu.views.genders")}
          aria-label={intl.get("menu.views.genders")}
        >
          <ListItemIcon>
            <TransgenderIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.genders")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("textcorpus")}
          title={intl.get("menu.views.textcorpus")}
          aria-label={intl.get("menu.views.textcorpus")}
        >
          <ListItemIcon>
            <AbcIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.textcorpus")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("other")}
          title={intl.get("menu.views.other")}
          aria-label={intl.get("menu.views.other")}
        >
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.other")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("totals")}
          title={intl.get("menu.views.totals")}
          aria-label={intl.get("menu.views.totals")}
        >
          <ListItemIcon>
            <FunctionsIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.totals")} />
        </ListItemButton>
        <ListItemButton
          onClick={() => setTableView("delta")}
          title={intl.get("menu.views.delta")}
          aria-label={intl.get("menu.views.delta")}
        >
          <ListItemIcon>
            <ChangeHistoryIcon />
          </ListItemIcon>
          <ListItemText primary={intl.get("menu.views.delta")} />
        </ListItemButton>
      </>
    );
  };

  return !initDone ? (
    <></>
  ) : (
    <ThemeProvider theme={appTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "12px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              title={intl.get("ui.action.open-menu")}
              aria-label={intl.get("ui.action.open-menu")}
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
              variant="h6"
              color="inherit"
              noWrap
              align="left"
              sx={{ flexGrow: 1 }}
            >
              {intl.get("app.title")}
            </Typography>
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
            <IconButton
              title={intl.get("ui.action.close-menu")}
              aria-label={intl.get("ui.action.close-menu")}
              onClick={toggleDrawer}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MenuItemsTable />
          </List>
          <AppInfo />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "97vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth={false} sx={{ mt: 4, mb: 30 }}>
            <Grid container spacing={2}>
              {/* Table & Graphs */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {tableView === "totals" ? (
                    <TotalsTable />
                  ) : tableView === "delta" ? (
                    <DeltaTable />
                  ) : (
                    <MetadataTable
                      view="main"
                      defaultSortField="version"
                      defaultSortAsc={false}
                    />
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <GraphBuilder />
              </Grid>
            </Grid>
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>
        </Box>
        <AppBar
          position="fixed"
          color="primary"
          sx={{ top: "auto", bottom: 0 }}
        >
          <Toolbar sx={{ justifyContent: "center" }}>
            <FilterSelectors />
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
