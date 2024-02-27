import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PinInput from "react-pin-input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography, Grid, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";

import Logo from "Assets/Images/logo.png";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { APPName, routePath, RESET_DATA } from "AppConstants";
import Validation from "./valditions";
import styles from "../styles";

const useStyles = makeStyles(styles);

const ResetCode = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);

  const classes = useStyles();
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const handleResetCode = (values) => {
    setLoading(true);
    const userData = localStorage.getItem(RESET_DATA)
      ? JSON.parse(localStorage.getItem(RESET_DATA))
      : "";

    setTimeout(() => {
      localStorage.setItem(
        RESET_DATA,
        JSON.stringify({ ...userData, code: values.code })
      );
      setLoading(false);
      navigate(`${routePath}forget-password/new-password`);
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
            {strings.enterSendCode}
          </Typography>

          <form
            className={classes.form}
            onSubmit={handleSubmit(handleResetCode)}
          >
            <Box dir="ltr" className={classes.pinWrapper}>
              <Controller
                name={"code"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PinInput
                    length={4}
                    value={value}
                    initialValue="0000"
                    onChange={onChange}
                    type="numeric"
                    inputMode="number"
                    style={{ padding: "10px" }}
                    autoSelect={true}
                    regexCriteria={/^[0-9]*$/}
                  />
                )}
              />
              {errors.code && (
                <p className="error__msg" role="alert">
                  {errors.code["message"][lang]}
                </p>
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

export default ResetCode;
