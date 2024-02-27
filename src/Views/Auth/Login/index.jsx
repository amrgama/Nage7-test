import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Logo from "Assets/Images/logo.png";
import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { APPName, routePath } from "AppConstants";
import { admin as adminServices } from "Services";
import Validation from "./valditions";

import styles from "../styles";

const useStyles = makeStyles(styles);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { handleUser } = useContext(UserContext);
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const handleLogin = async (data) => {
    setLoading(true);

    try {
      const {
        data: { token, ...user },
      } = await adminServices.adminSignIn({
        ...data,
        type: "TEACHER",
      });
      handleUser(user, token);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <Grid container classes={{ root: classes.wrapper }}>
      <Grid item xs={10} md={6} lg={5}>
        <Paper className={classes.container}>
          <figure className={classes.logo}>
            <img src={Logo} alt={APPName} />
          </figure>
          <Typography variant="h6" color="text.black">
            {strings.signIn} {strings.to} {strings.appName}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(handleLogin)}>
            <Box>
              <TextField
                label={strings.email}
                placeholder={strings.email}
                type={"email"}
                fullWidth
                error={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email && (
                <Typography variant="subtitle2" className="error_message">
                  {errors.email.message[lang]}
                </Typography>
              )}
            </Box>
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
            <Button
              type="submit"
              disabled={loading}
              variant={loading ? "outlined" : "contained"}
            >
              {loading ? strings.loading : strings.signIn}
            </Button>
          </form>
          {/* <Link to={`${routePath}forget-password`} className={classes.link}>
            {strings.forgotPassword}
          </Link> */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
