import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Logo from "Assets/Images/logo.png";
import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { APPName, RESET_DATA } from "AppConstants";
import Validation from "./valditions";
import styles from "../styles";

const useStyles = makeStyles(styles);

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { handleUser } = useContext(UserContext);

  const classes = useStyles();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const handleNewPassword = (values) => {
    setLoading(true);
    setTimeout(() => {
      handleUser(values, "just for test");
      localStorage.removeItem(RESET_DATA);
      setLoading(false);
    }, 2000);
  };

  return (
    <Grid container classes={{ root: classes.wrapper }}>
      <Grid item xs={10} md={6} lg={5}>
        <Paper className={classes.container}>
          <figure className={classes.logo}>
            <img src={Logo} alt={APPName} />
          </figure>
          <Typography variant="h6" color="text.black">
            {strings.enterNewPassword}
          </Typography>
          <form
            className={classes.form}
            onSubmit={handleSubmit(handleNewPassword)}
          >
            <Box>
              <TextField
                label={strings.password}
                placeholder={"********"}
                type={"password"}
                fullWidth
                error={Boolean(errors.password)}
                {...register("password")}
              />
              {errors.password && (
                <Typography variant="subtitle2" className="error_message">
                  {errors.password.message[lang]}
                </Typography>
              )}
            </Box>
            <Box>
              <TextField
                label={strings.confirmPassword}
                placeholder={"********"}
                type={"password"}
                fullWidth
                error={Boolean(errors.confirmPassword)}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <Typography variant="subtitle2" className="error_message">
                  {errors.confirmPassword.message[lang]}
                </Typography>
              )}
            </Box>

            <Button type="submit" disabled={loading} variant="contained">
              {loading ? "Loading.." : strings.submit}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
