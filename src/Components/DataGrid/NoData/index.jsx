import React from "react";
import { Typography, Box } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import strings from "Assets/Local/Local";

const NoData = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "20px",
      }}
    >
      <WarningAmberIcon sx={{ fontSize: 30 }} color="error" />
      <Typography variant="h6" color="error">
        {strings.noData}
      </Typography>
    </Box>
  );
};

export default NoData;
