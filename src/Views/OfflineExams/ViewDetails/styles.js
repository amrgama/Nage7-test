const styles = (theme) => ({
  basicInfoContainer: {
    justifyContent: "center",
  },
  documentsContainer: {
    paddingBlock: "20px",
  },
  typographyContainer: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    flexWrap: "wrap",
    marginBottom: "10px",
  },

  title: {
    color: theme.palette.secondary.main,
  },
  imgsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "25px",
    alignItems: "center",
    marginTop: "15px",
  },
  imageWrapper: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    borderRadius: "10px",
    gap: "8px",
    marginBottom: "10px",
    "& figure": {
      height: "200px",
      width: "100%",
      cursor: "pointer",
      "& img": {
        width: "auto",
        height: "100%",
        borderRadius: "4px",
      },
    },
  },
  dialog: {
    height: "60vh",
    "& img": {
      maxWidth: "100%",
      maxHeight: "98%",
      width: "auto",
      height: "auto",
    },
  },
  selectDialog: {
    padding: "20px",
    "& form": {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      "& button": {
        width: "fit-content",
        alignSelf: "center",
        paddingInline: "30px",
      },
    },
  },
  warningText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
