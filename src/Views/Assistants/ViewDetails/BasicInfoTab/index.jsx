import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import UserCard from "Components/UserCard";
import strings from "Assets/Local/Local";
import styles from "../styles";

const BasicInfo = ({ user }) => {
  const theme = useTheme();
  const classes = styles(theme);
  console.log("user", user)
  return (
    <Grid
      container
      component="section"
      spacing={3}
      sx={classes.basicInfoContainer}
    >
      <Grid item xs={12} md={6}>
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign={"center"}
        >
          {strings.teacher}
        </Typography>
        {
          !!Object.keys(user).length &&
          <UserCard user={user} />
        }
      </Grid>
    </Grid>
  );
};

export default BasicInfo;
