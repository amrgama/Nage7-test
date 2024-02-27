const styles = (theme) => ({
  userCard: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 0 10px 0 rgb(0 0 0 / 10%)",
    backgroundColor: "#fff",
    "& figure": {
      width: "80px",
      height: "80px",
      borderRadius: "8px",
      marginInline: "auto",
      "& img": {
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
        boxShadow: "0 0 10px 0 rgb(0 0 0 / 10%)",
      },
    },
  },
  title: {
    color: theme.palette.secondary.main,
  },
  company: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    "& a": {
      color: theme.palette.text.primary,
      textDecoration: "none",
    },
  },
  phone: {
    "& a": {
      color: theme.palette.text.black,
      textDecoration: "none",
    },
  },
});

export default styles;
