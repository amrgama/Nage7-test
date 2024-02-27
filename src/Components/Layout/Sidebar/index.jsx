import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { LangContext, DrawerContext, PathContext } from "App";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { APPName } from "AppConstants";
import Logo from "Assets/Images/logo.png";
import routes from "./routes";
import styles from "./styles";

const useStyles = makeStyles(styles);
const drawerWidth = "250px";
const Sidebar = () => {
  const { lang } = useContext(LangContext);
  const { handlePath } = useContext(PathContext);
  const { handleDrawer, isDrawerOpen } = useContext(DrawerContext);
  const classes = useStyles();

  const isSmall = useMediaQuery((th) => th.breakpoints.down("lg"));

  const drawer = (
    <>
      <Box className={classes.header}>
        <img src={Logo} alt={APPName} className={classes.logo} />
      </Box>
      <Box className={classes.content}>
        <List
          sx={{
            "& .MuiListItemIcon-root": { color: "inherit", minWidth: "auto" },
            "& .MuiTypography-root": { fontSize: "14px" },
          }}
        >
          {routes.map((route, index) => (
            <ListItem key={index}>
              {route.childs ? (
                <Accordion sx={{ width: "100%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-content-${index}`}
                    id="panel1a-header"
                  >
                    <ListItemIcon>{route.Icon}</ListItemIcon>

                    <ListItemText
                      primary={route.name[lang]}
                      sx={{ mx: "10px", fontSize: "14px" }}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    {route.childs.map((childEl) => (
                      <NavLink
                        to={childEl.path}
                        className={({ isActive }) =>
                          isActive ? classes.activeChild : classes.childTab
                        }
                        onClick={() => {
                          handlePath(childEl.name);
                          handleDrawer(false);
                        }}
                        key={childEl.path}
                      >
                        {/* <ListItemIcon>{route.Icon}</ListItemIcon> */}
                        {/* {route.Icon} */}
                        <ListItemText
                          primary={childEl.name[lang]}
                          secondary={childEl?.subChild?.[lang]}
                          sx={{ fontSize: "14px" }}
                        />
                      </NavLink>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ) : (
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    isActive ? classes.activeTab : classes.link
                  }
                  onClick={() => {
                    handlePath(route.name);
                    handleDrawer(false);
                  }}
                >
                  <ListItemIcon>{route.Icon}</ListItemIcon>
                  {/* {route.Icon} */}
                  <ListItemText primary={route.name[lang]} />
                </NavLink>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
  return !isSmall ? (
    <Drawer
      anchor={"left"}
      open={isDrawerOpen}
      onClose={() => handleDrawer(false)}
      classes={{ paper: classes.drawerContainer }}
      variant="permanent"
      sx={{
        display: { xs: "none", lg: "block" },
      }}
    >
      {drawer}
    </Drawer>
  ) : (
    <Drawer
      anchor={"left"}
      open={isDrawerOpen}
      onClose={() => handleDrawer(false)}
      classes={{ paper: classes.drawerContainer }}
      variant="temporary"
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
