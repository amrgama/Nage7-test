const styles = (theme) => ({
  dateContainer: {
    direction: "ltr",
    position: "relative",
    "& .rdp": {
      position: "absolute",
      backgroundColor: "#fff",
      boxShadow: "0px 1px 5px 3px #eeeeee73",
      zIndex: "10",
      top: "0",
      insetInlineEnd: "0",
    },
  },
  open: {
    display: "block",
  },
  close: {
    display: "none",
  },
});

export default styles;
