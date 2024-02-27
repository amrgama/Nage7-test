import { useContext } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DehazeIcon from "@mui/icons-material/Dehaze";
import LogoutIcon from "@mui/icons-material/Logout";
import { LangContext, PathContext, UserContext, DrawerContext } from "App";
import strings from "Assets/Local/Local";
import styles from "./styles";

const useStyles = makeStyles(styles);

const Header = () => {
  const { lang, handleLang } = useContext(LangContext);
  const { clearUser } = useContext(UserContext);
  const { handleDrawer, isDrawerOpen } = useContext(DrawerContext);
  const { path } = useContext(PathContext);

  const classes = useStyles();

  return (
    <header className={classes.headerContainer}>
      <Box className={classes.path}>
        <IconButton
          className={classes.drawerButton}
          onClick={() => handleDrawer(!isDrawerOpen)}
        >
          <DehazeIcon />
        </IconButton>
        <Typography variant="h6">{path[lang]} </Typography>
      </Box>
      <Box className={classes.actions}>
        <Button
          variant="text"
          onClick={() => {
            handleLang(lang === "ar" ? "en" : "ar");
          }}
          className={classes.langButton}
        >
          {lang === "ar" ? "E" : "ع"}
        </Button>
        <Button endIcon={<LogoutIcon />} onClick={clearUser}>
          {strings.logout}
        </Button>
      </Box>
    </header>
  );
};

export default Header;
