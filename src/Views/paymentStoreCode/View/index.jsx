import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import strings from "Assets/Local/Local";
import styles from "CommonStyles/ViewStyles";
import { routePath } from "AppConstants";
import ViewCodes from './codes'
const useStyles = makeStyles(styles);
const ViewPaymentCodes = () => {
  const classes = useStyles();
 
 


  return (
    <>
    
      <Box>
        <Button
          className={classes.addButton}
          endIcon={<AddIcon />}
          LinkComponent={Link}
          to={`${routePath}payment-Code/add`}
          variant="contained"
        >
          {strings.addpaymentCode}
        </Button>
        <ViewCodes />
      </Box>
    </>
  );
};

export default ViewPaymentCodes;
