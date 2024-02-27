import { useContext, useMemo, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Grid, Typography, TextField, MenuItem, Button } from "@mui/material";

import Select from "Components/Inputs/Select";
import strings from "Assets/Local/Local";
import { UserContext, LangContext } from "App";
import { EXAM_DETAILS } from "AppConstants";
import { detailsValidation } from "../validations";

const ExamDetails = ({ handleExamDetails }) => {
  const { user } = useContext(UserContext);
  const { lang } = useContext(LangContext);

  const subjects = useMemo(() => {
    if (user?.subjects) {
      return user.subjects;
    }
    return [];
  }, [user]);
  const defaultValues = useMemo(() => {
    return localStorage.getItem(EXAM_DETAILS)
      ? JSON.parse(localStorage.getItem(EXAM_DETAILS))
      : {};
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(detailsValidation),
    mode: "all",
  });
  console.log("errors===>", errors);
  useEffect(() => {
    Object.keys(defaultValues).forEach((key) => {
      setValue(key, defaultValues[key]);
    });
  }, [defaultValues]);

  return (
    <Grid
      item
      container
      spacing={3}
      component={"form"}
      onSubmit={handleSubmit(handleExamDetails)}
    >
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.theName}
          placeholder={strings.enterExamName}
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
        <Select
          name={"subject"}
          control={control}
          labelId={"exam-subject"}
          label={strings.selectSubject}
          fullWidth
          errors={Boolean(errors.subject)}
        >
          {subjects?.length ? (
            subjects.map((subject) => (
              <MenuItem value={subject.id} key={subject.id}>
                {subject.name[lang]}
              </MenuItem>
            ))
          ) : (
            <MenuItem value={""}>{strings.noSubjects}</MenuItem>
          )}
        </Select>
        {errors.subject && (
          <Typography variant="subtitle2" className="error_message">
            {errors.subject.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Select
          name={"type"}
          control={control}
          labelId={"exam-type"}
          label={strings.selectType}
          fullWidth
          errors={Boolean(errors.type)}
        >
          <MenuItem value={"EXAM"}>{strings.exam}</MenuItem>
          <MenuItem value={"HOME_WORK"}>{strings.homework}</MenuItem>
        </Select>
        {errors.type && (
          <Typography variant="subtitle2" className="error_message">
            {errors.type.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.questionLevel1Grade}
          placeholder={strings.enterLv1Grade}
          fullWidth
          error={Boolean(errors.firstGrade)}
          {...register("firstGrade")}
        />
        {errors.firstGrade && (
          <Typography variant="subtitle2" className="error_message">
            {errors.firstGrade.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.questionLevel2Grade}
          placeholder={strings.enterLv2Grade}
          fullWidth
          error={Boolean(errors.secondGrade)}
          {...register("secondGrade")}
        />
        {errors.secondGrade && (
          <Typography variant="subtitle2" className="error_message">
            {errors.secondGrade.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.questionLevel3Grade}
          placeholder={strings.enterLv3Grade}
          fullWidth
          error={Boolean(errors.thirdGrade)}
          {...register("thirdGrade")}
        />
        {errors.thirdGrade && (
          <Typography variant="subtitle2" className="error_message">
            {errors.thirdGrade.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label={strings.questionLevel4Grade}
          placeholder={strings.enterLv4Grade}
          fullWidth
          error={Boolean(errors.fourthGrade)}
          {...register("fourthGrade")}
        />
        {errors.fourthGrade && (
          <Typography variant="subtitle2" className="error_message">
            {errors.fourthGrade.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <Button type="submit" variant="contained" color="primary" size="large">
          {strings.next}
        </Button>
      </Grid>
    </Grid>
  );
};

export default ExamDetails;
