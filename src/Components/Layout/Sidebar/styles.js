const styles = (theme) => ({
  drawerContainer: {
    width: "16.666667%",
    background: theme.palette.primary.main + " !important",
  },
  header: {
    paddingBlock: "15px",
    marginInline: "auto",
    backgroundColor: theme.palette.primary.white,
    textAlign: "center",
    width: "100%",
    "& img": {
      maxWidth: "150px",
      maxHeight: "150px",
      width: "auto",
      height: "auto",
    },
  },

  link: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.white,
    padding: "5px",
    borderRadius: "5px",
    boxShadow:
      "0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(60 72 88 / 40%)",
  },
  activeTab: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: theme.palette.primary.white,
    background: theme.palette.secondary.main,
    padding: "5px",
    borderRadius: "5px",
    boxShadow:
      "0 4px 20px 0 rgb(0 0 0 / 14%), 0 7px 10px -5px rgb(60 72 88 / 40%)",
  },
  childTab: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: theme.palette.primary.main,
    padding: "5px",
    borderRadius: "5px",
  },
  activeChild: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: theme.palette.secondary.main,
    fontWeight: "700",
    padding: "5px",
    borderRadius: "0px",
    borderBottom: "2px solid " + theme.palette.secondary.main,
  },
});

export default styles;
