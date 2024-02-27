const styles = () => ({
  phoneContainer: {
    "& .phoneinput__wrapper": {
      border: "1px solid #e0e0e0",
      borderRadius: "4px",
      padding: "5px 0",
    },
    "& .phoneinput__wrapper > div": {
      insetInlineEnd: "0",
    },
    "& .selected-flag": {
      display: "flex",
      justifyContent: "center",
    },
    "& .phoneinput__wrapper input": {
      direction: "ltr",
      border: "none",
      width: "95%",
    },
  },
});

export default styles;
