const style = (theme) => ({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    background: theme.palette.secondary.linear,
    minHeight: "100vh",
  },
  container: {
    background: theme.palette.primary.white,
    padding: "15px 20px",
    textAlign: "center",
    "& > figure": {
      display: "inline-block",
      marginInline: "auto",
      maxWidth: "150px",
      maxHeight: "150px",
      marginBottom: "10px",
      "& > img": {
        maxWidth: "100%",
        maxHeight: "100%",
      },
    },
  },
  form: {
    marginBlock: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    "& input": {
      color: theme.palette.text.gray,
    },
  },
  link: {
    color: theme.palette.text.secondary,
    textDecoration: "none",
    fontWeight: "500",
  },
  pinWrapper: {
    textAlign: "center",
    marginBlock: "20px",
    "& input": {
      borderRadius: "8px",
      border: "1px solid #ccc !important",
    },
  },
});

export default style;
