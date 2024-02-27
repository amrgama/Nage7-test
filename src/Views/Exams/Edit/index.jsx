import React, { useState, useContext, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
  Autocomplete,
  createFilterOptions,
} from "@mui/material";

import DatePicker from "Components/DatePicker";
import ImgUpload from "Components/Inputs/ImgUpload/ImgUpload";

import examModuleServices from "Services/ExamModules";
import strings from "Assets/Local/Local";
import { LangContext, UserContext } from "App";
import { routePath } from "AppConstants";
import Validation from "./validations";

import styles from "CommonStyles/AddStyles";
import groupServices from "Services/group";
import studentServices from "Services/student";
import useQueryService from "Hooks/useQueryService";
import examServices from "Services/exams";

const useStyles = makeStyles(styles);
const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option) => option.name,
});
const EditExam = () => {
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(LangContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(Validation),
    mode: "all",
  });
  useEffect(() => {
    const today = new Date();
    setValue("to", new Date(today.getTime() + 24 * 60 * 60 * 1000));
    setValue("from", new Date());
  }, []);
  const subject = watch("subject");
  const examType = watch("type");
  const { data: examData, isLoading: isLoadingData } = useQueryService({
    key: ["examServices.getById", id],
    fetcher: () => examServices.getById(id),
    enabled: !!id,
    onSuccess: (data) => {
      const { exam } = data;
      const values = {
        name: exam.name ?? "",
        subject: exam.subject ?? 0,
        type: exam.type ?? "",
        duration: exam.duration ?? 0,
        from: exam.from ?? 0,
        to: exam.to ?? 0,
        examModels: exam.examModels.map((el) => ({ id: el })),
        groups: exam.groups.map((el) => ({ id: el })),
        students: exam.students.map((el) => ({ id: el })),
      };
      reset(values);
    },
  });
  const { data: examModelsData, isLoading: loadingExamModels } =
    useQueryService({
      key: [
        "examModuleServices.getExamModules",
        { all: true, type: examType, subject },
      ],
      fetcher: () =>
        examModuleServices.getExamModules({
          all: true,
          type: examType,
          subject,
        }),
      enabled: !!(examType && subject),
    });
  const { data: groupsData, isLoading: loadingGroups } = useQueryService({
    key: ["groupServices.getAll", { all: true, subject }],
    fetcher: () => groupServices.getAll({ all: true, subject }),
    enabled: !!subject,
  });
  const { data: studentsData, isLoading: loadingStudents } = useQueryService({
    key: ["studentServices.getAll", { all: true }],
    fetcher: () => studentServices.getAll({ all: true }),
  });
  const handleEdit = async (values) => {
    // console.log('valuesss===>',values)
    setLoading(true);
    try {
      let data = {
        ...values,
        examModels: values.examModels.map((v) => v.id),
      };

      if (values.students.length > 0) {
        data.students = values.students.map((v) => v.id);
      } else {
        delete data.students;
      }
      if (values.groups.length > 0) {
        data.groups = values.groups.map((v) => v.id);
      } else {
        delete data.groups;
      }
      // console.log('valuesss===>',data,values.students.length,values?.groups?.length)
      const response = await examServices.updateById(id, data);

      if (response.status === 200) {
        navigate(`${routePath}exams`);
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
  const subjects = user?.subjects || [];
  const examModels = examModelsData?.data || [];
  const groups = groupsData?.data || [];
  const students = studentsData?.data || [];
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
        <Typography variant="h5">{strings.editExam}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          InputLabelProps={{ shrink: true }}
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
                  setValue("examModels", []);
                  setValue("groups", []);
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
          name="type"
          defaultValue=""
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl fullWidth>
              <InputLabel id="add-user-type">{strings.selectType}</InputLabel>
              <MuiSelect
                fullWidth
                labelId="add-user-type"
                id="select-add-user-type"
                label={strings.selectType}
                error={Boolean(error)}
                {...field}
                onChange={(e) => {
                  setValue("examModels", []);
                  field.onChange(e);
                }}
              >
                <MenuItem value={"EXAM"}>{strings.EXAM}</MenuItem>
                <MenuItem value={"HOME_WORK"}>{strings.HOME_WORK}</MenuItem>
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
          name="examModels"
          defaultValue={[]}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              multiple
              options={examModels}
              getOptionLabel={(option) =>
                examModels.find((exam) => exam.id === option.id)?.name
              }
              loading={loadingExamModels && !!(examType && subject)}
              onChange={(e, value) => field.onChange(value)}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              renderInput={(params) => (
                <TextField
                  InputLabelProps={{ shrink: true }}
                  {...params}
                  label={strings.addExamModule}
                  placeholder={strings.addExamModule}
                  error={Boolean(error)}
                  helperText={error && error.message[lang]}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="groups"
          defaultValue={[]}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              multiple
              options={groups}
              getOptionLabel={(option) =>
                groups.find((group) => group.id === option.id)?.name
              }
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              loading={loadingGroups && !!subject}
              onChange={(e, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  InputLabelProps={{ shrink: true }}
                  {...params}
                  label={strings.addGroup}
                  placeholder={strings.addGroup}
                  error={Boolean(error)}
                  helperText={error && error.message[lang]}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="students"
          defaultValue={[]}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              multiple
              options={students}
              getOptionLabel={(option) =>
                students.find((student) => student.id === option.id)?.name
              }
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              loading={loadingStudents}
              onChange={(e, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  InputLabelProps={{ shrink: true }}
                  {...params}
                  label={strings.addStudent}
                  placeholder={strings.addStudent}
                  error={Boolean(error)}
                  helperText={error && error.message[lang]}
                />
              )}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DatePicker
          control={control}
          name={"from"}
          label={strings.startDate}
          fullWidth
        />
        {errors.from && (
          <Typography variant="subtitle2" className="error_message">
            {errors.from.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <DatePicker
          control={control}
          name={"to"}
          label={strings.endDate}
          fullWidth
        />
        {errors.to && (
          <Typography variant="subtitle2" className="error_message">
            {errors.to.message[lang]}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="duration"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <TextField
                InputLabelProps={{ shrink: true }}
                label={strings.examDuration}
                placeholder={strings.examDuration}
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
      {/* <Grid item xs={12} md={6}>
        <Controller
          name="lesson"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <TextField
                label={strings.lesson}
                placeholder={strings.lesson}
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

export default EditExam;
