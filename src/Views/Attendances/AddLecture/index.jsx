import React, { useState, useContext } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
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
import lectureServices from "Services/lectures";
import groupServices from "Services/group";
import strings from "Assets/Local/Local";
import { LangContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";
import styles from "CommonStyles/AddStyles";
import useQueryService from "Hooks/useQueryService";
// import { toast } from "react-toastify";
import "./attendance.css";
import moment from "moment";


const useStyles = makeStyles(styles);

const AddLecture = () => {
  const [loading, setLoading] = useState(false);

  const { lang } = useContext(LangContext);

  const navigate = useNavigate();
  const classes = useStyles();
  const listOfDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const day = moment().format('dddd');; // Thursday Feb 2015
  const dayIndex = listOfDays.indexOf(day);

  const { data: groupsData, isLoading: loadingGroups } = useQueryService({
    key: ["groupServices.getAll", { all: true }],
    fetcher: () => groupServices.getAll({ all: true }),
  });
  // const groups = groupsData?.data ?? [];
  const groups = groupsData?.data.filter((el) => el.selectedDays.indexOf(dayIndex) !== -1) ?? [];


  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    setValue,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      const result = await lectureServices.add(values);
      // const message = {
      //   ar: "تم تسجيل الطالب بالحضور",
      //   en: "Student signned in attendance successfully",
      // };
      // toast.success(message[lang]);

      navigate(
        `${routePath}attendances/add/${result.data.attendanceLecture.id}`
      );
    } catch (error) {
      console.log("error when add ", error);
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
      onSubmit={handleSubmit(handleAdd)}
      spacing={3}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{strings.addLecture}</Typography>
      </Grid>
      <Grid item md={6} xs={12}>
        <Controller
          name="group"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-user-group">{strings.group}</InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-group"
                id={"select-add-user-group"}
                label={strings.group}
                error={Boolean(error)}
                {...field}
              >
                {groups?.map((group) => (
                  <MenuItem value={group.id} key={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {error && (
                <Typography variant="subtitle2" className="error_message">
                  {error.message[lang]}
                </Typography>
              )}
            </FormControl>
          )}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <div>
          <TextField
            label={strings.lesson}
            placeholder={strings.lesson}
            fullWidth
            error={Boolean(errors.lesson)}
            {...register("lesson")}
          />
          {errors.lesson && (
            <Typography variant="subtitle2" className="error_message">
              {errors.lesson.message[lang]}
            </Typography>
          )}
        </div>
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

export default AddLecture;
