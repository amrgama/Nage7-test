const styles = (theme) => ({
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px ",
    boxShadow: "27px 2px 75px -20px rgb(0 0 0 / 75%)",
    backgroundColor: "#fff",
  },
  path: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  drawerButton: {
    display: "none !important",
    [theme.breakpoints.down("lg")]: {
      display: "inline-flex !important",
    },
  },
  actions: {
    display: "flex",
    alignItems: "center",
    "& button": {
      fontWeight: "700",
    },
    langButton: {
      fontSize: "18px",
    },
  },
});
export default styles;
