const styles = (theme) => ({
  actionsContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    "& > button": {
      marginBottom: "0 !important",
    },
  },
  addButton: {
    display: "flex !important",
    marginInlineStart: "auto !important",
    marginBottom: theme.spacing(2) + " !important",
    width: "fit-content"
  },
  viewButton: {
    backgroundColor: theme.palette.primary.main + " !important",
    color: theme.palette.primary.white + " !important",
  },
  editButton: {
    backgroundColor: theme.palette.secondary.main + " !important",
    color: theme.palette.primary.white + " !important",
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main + " !important",
    color: theme.palette.primary.white + " !important",
    "&:disabled": {
      backgroundColor: theme.palette.text.gray + " !important",
      color: theme.palette.text.info + " !important",
      cursor: "not-allowed !important",
      pointerEvents: "all !important",
    },
  },
  customDrawer: {
    maxWidth: "40% !important",
  },

  statusActions: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    "& button": {
      color: theme.palette.primary.white,
    },
  },
  imageContainer: {
    width: "100%",
    maxHeight: "100px",
    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
      width: "auto",
      height: "auto",
    },
  },
  usersContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
});

export default styles;
