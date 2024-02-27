import React, { useState, useContext } from "react";
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

import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import examServices from "Services/exams";
import useQueryService from "Hooks/useQueryService";
import lectureServices from "Services/lectures";

const useStyles = makeStyles(styles);

const AddExam = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });
  const handleAdd = async (values) => {
    // console.log('valuesss===>',values)
    setLoading(true);
    try {
      let data = {
        ...values,
        type: "OFFLINE_EXAM",
      };
      // console.log('valuesss===>',data,values.students.length,values?.groups?.length)
      const response = await examServices.add(data);

      if (response.status === 200) {
        navigate(`${routePath}offline-exams`);
      } else {
        reject(response);
      }
    } catch (error) {
      console.log("error when add user ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const subject = watch("subject");
  const { data: lecturesData } = useQueryService({
    key: ["lectureServices.getAll", { all: true, subject }],
    fetcher: () => lectureServices.getAll({ all: true, subject }),
    enabled: !!subject,
  });
  const subjects = user?.subjects ?? [];
  const lectures = lecturesData?.data ?? [];
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
        <Typography variant="h5">{strings.addExam}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.examName}
          placeholder={strings.examName}
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
        <Controller
          name="maxGrade"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <TextField
                label={strings.totalGrades}
                placeholder={strings.totalGrades}
                fullWidth
                type="number"
                error={Boolean(error)}
                {...field}
                onChange={(e) => field.onChange(+e.target.value)}
              />
              {error && (
                <Typography variant="subtitle2" className="error_message">
                  {error.message[lang]}
                </Typography>
              )}
            </div>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name={`subject`}
          defaultValue=""
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-user-subject">
                {strings.selectSubject}
              </InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-subject"
                id="select-add-user-subject"
                label={strings.selectSubject}
                error={Boolean(error)}
                {...field}
                onChange={(e) => {
                  setValue("attendanceLecture", "");
                  field.onChange(e);
                }}
              >
                {subjects?.map((subject) => (
                  <MenuItem value={subject.id} key={subject.id}>
                    {subject.name[lang]}
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
      <Grid item xs={12} md={6}>
        <Controller
          name={`attendanceLecture`}
          defaultValue=""
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-user-attendanceLecture">
                {strings.lesson}
              </InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-attendanceLecture"
                id="select-add-user-attendanceLecture"
                label={strings.lesson}
                error={Boolean(error)}
                {...field}
              >
                {lectures.map((lecture) => (
                  <MenuItem value={lecture.id} key={lecture.id}>
                    {lecture.group.name} - {lecture.date}
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

export default AddExam;
