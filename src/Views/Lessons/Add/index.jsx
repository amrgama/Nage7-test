import React, { useState, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Grid,
  Typography,
  TextField,
} from "@mui/material";


import lessonServices from "Services/lesson";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";

const useStyles = makeStyles(styles);

const AddLesson = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);

  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      await lessonServices.add(values);
      navigate(`${routePath}lessons`);
    } catch (error) {
      console.log("error when add ", error);
      error?.response?.data?.errors?.forEach?.(({ param, msg }) => {
        if (param in values)
          setError(param, { type: "custom", message: { ar: msg, en: msg } })
      })
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
      onSubmit={handleSubmit(handleAdd)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.addLesson}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.name}
          placeholder={strings.name}
          fullWidth
          error={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name && (
          <Typography variant="subtitle2" className="error_message">
            {errors.name.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.number}
          placeholder={strings.number}
          fullWidth
          type="number"
          error={Boolean(errors.number)}
          {...register("number")}
        />
        {errors.number && (
          <Typography variant="subtitle2" className="error_message">
            {errors.number.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <Button
          type="submit"
          disabled={loading}
          variant={loading ? "outlined" : "contained"}
        >
          {loading ? strings.loading : strings.add}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddLesson;
