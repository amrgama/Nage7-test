import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Logo from "Assets/Images/logo.png";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { APPName, routePath, RESET_DATA } from "AppConstants";
import Validation from "./valditions";
import styles from "../styles";

const useStyles = makeStyles(styles);
const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);

  const classes = useStyles();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const handleForgetPassword = (values) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(RESET_DATA, JSON.stringify({ email: values.email }));
      setLoading(false);
      navigate(`${routePath}forget-password/code`);
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
            {strings.enterEmail}
          </Typography>
          <form
            className={classes.form}
            onSubmit={handleSubmit(handleForgetPassword)}
          >
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

            <Button type="submit" disabled={loading} variant="contained">
              {loading ? "Loading.." : strings.send}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForgetPassword;
