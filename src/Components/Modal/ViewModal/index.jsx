import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import style from "./styles";

const useStyles = makeStyles(style);

const ViewModel = ({
  openViewModel,
  handleClose,
  ImgData,
}) => {
  const classes = useStyles();
  return (
    <Modal
      open={openViewModel}
      onClose={handleClose}
      aria-labelledby="modal-modal-delete"
    >
      <Box className={classes.modalContainer}>
        <IconButton
          className={classes.closeButton}
          color="error"
          size="large"
          onClick={handleClose}
        >
          <HighlightOffIcon />
        </IconButton>
        <img src={ImgData} alt="view-Image-Modal" className={classes.imageView}/>
      </Box>
    </Modal>
  );
};

export default ViewModel;
