import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";

import DatePicker from "Components/DatePicker";
import lessonServices from "Services/lesson";
import useQueryService from "Hooks/useQueryService";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { Loading } from "routes";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";

const useStyles = makeStyles(styles);

const EditLesson = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { id } = useParams();

  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setError
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const { isLoading } = useQueryService({
    key: ["lessonServices.getById", id],
    fetcher: () => lessonServices.getById(id),
    enabled: !!id,
    onSuccess: (data) => {
      const { lesson } = data
      const values = {
        name: lesson.name
      };
      reset(values);
    },
  });

  const handleEdit = async (values) => {
    setLoading(true)
    try {
      await lessonServices.updateById(id, values);
      navigate(`${routePath}lessons`);
    } catch (error) {
      console.log("error when update user ", error);
      error?.response?.data?.errors?.forEach?.(({ param, msg }) => {
        if (param in values)
          setError(param, { type: "custom", message: { ar: msg, en: msg } })
      })
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Grid
      container
      classes={{ root: classes.wrapper }}
      component="form"
      onSubmit={handleSubmit(handleEdit)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.editLesson}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          InputLabelProps={{ shrink: true }}
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
      {/* <Grid item xs={12} md={6}>
        <TextField
          InputLabelProps={{ shrink: true }}
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
      </Grid> */}
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
export default EditLesson;