const styles = (theme) => ({
  buttonContainer: {
    textAlign: "center",
    "& > button": {
      minWidth: "200px",
      fontWeight: "700",
    },
  },
  buttonPostContainer: {
    textAlign: "center",
    "& > button": {
      minWidth: "200px",
      fontWeight: "700",
    },
  },
  loadingContainer: {
    textAlign: "center",
  },

  editButton: {
    backgroundColor: theme.palette.secondary.main + " !important",
    color: theme.palette.primary.white + " !important",
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main + " !important",
    color: theme.palette.primary.white + " !important",
  },
  select: {
    "& .MuiSelect-select": {
      color: theme.palette.secondary.main,
    },
    "& fieldset": {
      color: theme.palette.secondary.main,
    },
  },
  multiSelectContainer: {
    "& .select__menu": {
      zIndex: "10 ",
    },
  },
  imgProfileContainer: {
    textAlign: "center",
    "& > div >div": {
      justifyContent: "center",
    },
  },
});

export default styles;
