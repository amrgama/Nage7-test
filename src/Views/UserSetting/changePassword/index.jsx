import React, { useState, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {  useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {Button,Grid,Typography,TextField,} from "@mui/material";
import myProfileServices from "Services/myProfile";
import strings from "Assets/Local/Local";
import { LangContext} from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";
import styles from "CommonStyles/AddStyles";

const useStyles = makeStyles(styles);

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const classes = useStyles();
  const navigate = useNavigate();



  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
   
  });
 
  const handleEdit = async ({ confirmPassword, ...values }) => {
    setLoading(true);
    const data = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    }
    try {
      await myProfileServices.changePassword(data);
      navigate(`${routePath}myProfile`);
    } catch (error) {
      console.log("error when add user ", error);
      error?.response?.data?.errors?.forEach?.(({ param, msg }) => {
        if (param in values)
          setError(param, { type: "custom", message: { ar: msg, en: msg } });
      });
    } finally {
      setLoading(false);
    }
  };
  console.log(errors);

  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleEdit)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.changePassword}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.currentPassword}
          placeholder={"********"}
          fullWidth
          type="password"
          error={Boolean(errors.currentPassword)}
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <Typography variant="subtitle2" className="error_message">
            {errors.currentPassword.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}> </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.enterNewPassword}
          placeholder={"********"}
          fullWidth
          type="password"
          error={Boolean(errors.newPassword)}
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <Typography variant="subtitle2" className="error_message">
            {errors.newPassword.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.confirmPassword}
          placeholder={"********"}
          fullWidth
          type="password"
          error={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <Typography variant="subtitle2" className="error_message">
            {errors.confirmPassword.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <Button
          type="submit"
          disabled={loading}
          variant={loading ? "outlined" : "contained"}
        >
          {loading ? strings.loading : strings.edit}
        </Button>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
