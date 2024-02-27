const styles = (theme) => ({
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "15px",
    boxShadow: 24,

    "& > svg": {
      color: theme.palette.error.main,
      width: "50px",
      height: "50px",
    },
  },

  closeButton: {
    position: "absolute !important",
    top: "0",
    insetInlineEnd: "0 !important",
  },

  deleteButton: {
    padding: "5px 25px",
    minWidth: "50% !important",
    fontWeight: "bold !important",
    fontSize: "18px !important",
    background: theme.palette.primary.linear
  },
});

export default styles;
