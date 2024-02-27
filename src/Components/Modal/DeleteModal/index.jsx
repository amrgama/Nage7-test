import React from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";

import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import strings from "Assets/Local/Local";
import rejectImage from "Assets/Images/reject.png";
import style from "./styles";

const useStyles = makeStyles(style);

const DeleteModal = ({
  handlePrintBack = null,
  buttonBack = null,
  openDeleteModal,
  handleClose,
  deleteTitle,
  handleDelete,
  loading,
  button,
  icon,
}) => {
  const classes = useStyles();
  return (
    <Modal
      open={openDeleteModal}
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
        {icon ?? <img src={rejectImage} alt="DeleteForeverIcon" />}
        {deleteTitle && (
          <Typography id="modal-modal-delete" variant="h6" component="h2">
            {deleteTitle}
          </Typography>
        )}
        <Box display={'flex'} justifyContent={'space-around'} width={'100%'}>
          <Button
            onClick={handleDelete}
            disabled={loading}
            // color="error"
            variant={loading ? "outlined" : "contained"}
            className={classes.deleteButton}
            sx={{mx:1}}
          >
            {loading ? strings.loading : button ?? strings.delete}
          </Button>
          {buttonBack ?
            <Button
              onClick={handlePrintBack}
              disabled={loading}
              color="error"
              variant={loading ? "outlined" : "contained"}
              className={classes.deleteButton}
              sx={{mx:1}}
            >
              {loading ? strings.loading : buttonBack ?? strings.delete}
            </Button> : null}
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;
